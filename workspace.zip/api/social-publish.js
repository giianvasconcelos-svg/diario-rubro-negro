function supabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase não configurado');
  return { url: url.replace(/\/$/, ''), key };
}

function requestOrigin(request) {
  const host = request.headers['x-forwarded-host'] || request.headers.host;
  const proto = request.headers['x-forwarded-proto'] || 'https';
  return `${proto}://${host}`;
}

async function verifyEditor(request) {
  const authHeader = request.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  const userToken = authHeader.slice(7);
  const { url, key } = supabaseConfig();

  const userResponse = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: key, Authorization: `Bearer ${userToken}` },
  });
  if (!userResponse.ok) return null;
  const user = await userResponse.json();
  if (!user?.id) return null;

  const params = new URLSearchParams({ id: `eq.${user.id}`, select: 'role', limit: '1' });
  const profileResponse = await fetch(`${url}/rest/v1/profiles?${params.toString()}`, {
    headers: { apikey: key, Authorization: `Bearer ${userToken}` },
  });
  if (!profileResponse.ok) return null;
  const profiles = await profileResponse.json();
  const role = profiles?.[0]?.role;
  if (role !== 'admin' && role !== 'editor') return null;

  return { userToken, userId: user.id, role };
}

async function loadPublishedNews(newsId) {
  const { url, key } = supabaseConfig();
  const params = new URLSearchParams({
    id: `eq.${newsId}`,
    status: 'eq.published',
    select: 'id,title,excerpt,image,published_at,created_at',
    limit: '1',
  });

  const response = await fetch(`${url}/rest/v1/news?${params.toString()}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) throw new Error(`Supabase HTTP ${response.status}`);
  const rows = await response.json();
  return rows?.[0] || null;
}

async function publishToX(news, canonical) {
  const token = process.env.X_USER_ACCESS_TOKEN;
  if (!token) return { status: 'not_configured' };

  const maxTitle = 220;
  const text = `${String(news.title || '').slice(0, maxTitle)}\n\n${canonical}`;
  const response = await fetch('https://api.x.com/2/tweets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) return { status: 'error', httpStatus: response.status, detail: payload?.detail || payload?.title || 'Falha no X' };
  return { status: 'published', id: payload?.data?.id };
}

async function publishToInstagram(news, canonical) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const igUserId = process.env.INSTAGRAM_USER_ID;
  const graphVersion = process.env.META_GRAPH_VERSION;
  if (!token || !igUserId || !graphVersion) return { status: 'not_configured' };
  if (!news.image) return { status: 'skipped', reason: 'A matéria não possui imagem pública.' };

  const caption = `${String(news.title || '')}\n\n${String(news.excerpt || '').slice(0, 1000)}\n\nLeia mais: ${canonical}`;
  const createParams = new URLSearchParams({
    image_url: news.image,
    caption,
    access_token: token,
  });

  const base = `https://graph.facebook.com/${encodeURIComponent(graphVersion)}`;
  const createResponse = await fetch(`${base}/${encodeURIComponent(igUserId)}/media?${createParams.toString()}`, { method: 'POST' });
  const createPayload = await createResponse.json().catch(() => ({}));
  if (!createResponse.ok || !createPayload?.id) {
    return { status: 'error', httpStatus: createResponse.status, detail: createPayload?.error?.message || 'Falha ao criar mídia no Instagram' };
  }

  const publishParams = new URLSearchParams({ creation_id: createPayload.id, access_token: token });
  const publishResponse = await fetch(`${base}/${encodeURIComponent(igUserId)}/media_publish?${publishParams.toString()}`, { method: 'POST' });
  const publishPayload = await publishResponse.json().catch(() => ({}));
  if (!publishResponse.ok) {
    return { status: 'error', httpStatus: publishResponse.status, detail: publishPayload?.error?.message || 'Falha ao publicar no Instagram' };
  }

  return { status: 'published', id: publishPayload?.id };
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ status: 'error', message: 'Método não permitido' });
  }

  try {
    const editor = await verifyEditor(request);
    if (!editor) return response.status(403).json({ status: 'error', message: 'Acesso restrito a editores.' });

    const newsId = request.body?.newsId;
    if (!newsId) return response.status(400).json({ status: 'error', message: 'Notícia não informada.' });

    const news = await loadPublishedNews(newsId);
    if (!news) return response.status(404).json({ status: 'error', message: 'Notícia publicada não encontrada.' });

    const canonical = `${requestOrigin(request)}/noticias/${encodeURIComponent(news.id)}`;
    const [x, instagram] = await Promise.all([
      publishToX(news, canonical),
      publishToInstagram(news, canonical),
    ]);

    return response.status(200).json({ status: 'ok', x, instagram });
  } catch (error) {
    console.error('social-publish error', error);
    return response.status(500).json({ status: 'error', message: 'Não foi possível processar a publicação social.' });
  }
}
