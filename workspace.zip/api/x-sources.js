const ACCOUNTS = ['renanmoura1989', 'futebol_info'];

function normalizeItems(data, users = []) {
  const userById = new Map((users || []).map((user) => [user.id, user.username]));

  return (data || [])
    .filter((post) => String(post.text || '').toLowerCase().includes('flamengo'))
    .map((post) => {
      const username = userById.get(post.author_id) || '';
      return {
        id: String(post.id),
        text: String(post.text || '').trim(),
        createdAt: post.created_at || new Date().toISOString(),
        username,
        url: username ? `https://x.com/${username}/status/${post.id}` : `https://x.com/i/web/status/${post.id}`,
      };
    });
}

async function searchRecent(token) {
  const query = `Flamengo (${ACCOUNTS.map((username) => `from:${username}`).join(' OR ')}) -is:retweet`;
  const params = new URLSearchParams({
    query,
    max_results: '25',
    'tweet.fields': 'created_at,author_id',
    expansions: 'author_id',
    'user.fields': 'username',
  });

  const response = await fetch(`https://api.x.com/2/tweets/search/recent?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error(`X recent search HTTP ${response.status}`);
  const payload = await response.json();
  return normalizeItems(payload.data, payload.includes?.users);
}

async function fetchTimelineForUser(token, username) {
  const userResponse = await fetch(`https://api.x.com/2/users/by/username/${encodeURIComponent(username)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!userResponse.ok) throw new Error(`X user lookup HTTP ${userResponse.status}`);
  const userPayload = await userResponse.json();
  const userId = userPayload?.data?.id;
  if (!userId) return [];

  const params = new URLSearchParams({
    max_results: '10',
    'tweet.fields': 'created_at,author_id',
    exclude: 'retweets,replies',
  });
  const postsResponse = await fetch(`https://api.x.com/2/users/${userId}/tweets?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!postsResponse.ok) throw new Error(`X timeline HTTP ${postsResponse.status}`);
  const postsPayload = await postsResponse.json();
  return normalizeItems(postsPayload.data, [{ id: userId, username }]);
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ status: 'error', items: [], message: 'Método não permitido' });
  }

  const token = process.env.X_BEARER_TOKEN;
  if (!token) {
    return response.status(200).json({
      status: 'not_configured',
      items: [],
      message: 'Configure X_BEARER_TOKEN na Vercel para ativar as fontes sociais.',
    });
  }

  try {
    let items = [];

    try {
      items = await searchRecent(token);
    } catch (searchError) {
      console.warn('X recent search unavailable, trying timelines', searchError);
      const results = await Promise.allSettled(ACCOUNTS.map((username) => fetchTimelineForUser(token, username)));
      items = results.flatMap((result) => result.status === 'fulfilled' ? result.value : []);
    }

    const unique = Array.from(new Map(items.map((item) => [item.id, item])).values())
      .filter((item) => item.text.toLowerCase().includes('flamengo'))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=900');
    return response.status(200).json({ status: 'ok', items: unique.slice(0, 20) });
  } catch (error) {
    console.error('x-sources error', error);
    return response.status(502).json({ status: 'error', items: [], message: 'Não foi possível consultar as fontes do X.' });
  }
}
