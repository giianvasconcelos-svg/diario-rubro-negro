function supabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase não configurado');
  return { url: url.replace(/\/$/, ''), key };
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function requestOrigin(request) {
  const host = request.headers['x-forwarded-host'] || request.headers.host;
  const proto = request.headers['x-forwarded-proto'] || 'https';
  return `${proto}://${host}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(value));
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).send('Método não permitido');
  }

  const id = Array.isArray(request.query?.id) ? request.query.id[0] : request.query?.id;
  if (!id) return response.status(400).send('Notícia não informada');

  try {
    const { url, key } = supabaseConfig();
    const params = new URLSearchParams({
      id: `eq.${id}`,
      status: 'eq.published',
      select: 'id,title,excerpt,content,category,image,tags,created_at,updated_at,published_at',
      limit: '1',
    });

    const upstream = await fetch(`${url}/rest/v1/news?${params.toString()}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });

    if (!upstream.ok) throw new Error(`Supabase HTTP ${upstream.status}`);
    const rows = await upstream.json();
    const news = rows?.[0];
    if (!news) return response.status(404).send('Notícia não encontrada');

    const origin = requestOrigin(request);
    const canonical = `${origin}/noticias/${encodeURIComponent(news.id)}`;
    const published = news.published_at || news.created_at || new Date().toISOString();
    const modified = news.updated_at || published;
    const image = news.image || `${origin}/favicon.ico`;
    const title = news.title || 'Diário Rubro-Negro';
    const description = news.excerpt || '';
    const paragraphs = String(news.content || description)
      .split(/\n\n+|\r\n\r\n+/)
      .filter(Boolean)
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join('');

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: title,
      description,
      image: [image],
      datePublished: published,
      dateModified: modified,
      isAccessibleForFree: true,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      author: [{ '@type': 'Organization', name: 'Redação DRN', url: `${origin}/redacao` }],
      publisher: { '@type': 'Organization', name: 'Diário Rubro-Negro', url: origin },
    };

    const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(title)} | Diário Rubro-Negro</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
  <link rel="canonical" href="${escapeHtml(canonical)}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${escapeHtml(canonical)}" />
  <meta property="og:image" content="${escapeHtml(image)}" />
  <meta property="article:published_time" content="${escapeHtml(published)}" />
  <meta property="article:modified_time" content="${escapeHtml(modified)}" />
  <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
  <style>
    :root{font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#171717;background:#f5f5f5}*{box-sizing:border-box}body{margin:0}header{background:#991b1b;color:#fff;padding:20px}header a{color:#fff;text-decoration:none;font-weight:800}.wrap{max-width:900px;margin:0 auto}.article{background:#fff;margin:28px auto;padding:28px;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.08)}h1{font-size:clamp(2rem,5vw,3.25rem);line-height:1.05;margin:12px 0}.meta{color:#666;font-size:.95rem;margin-bottom:22px}.category{display:inline-block;background:#fee2e2;color:#991b1b;padding:6px 10px;border-radius:999px;font-size:.78rem;font-weight:800}.hero{width:100%;max-height:520px;object-fit:cover;border-radius:12px;margin:12px 0 24px}.body{font-size:1.12rem;line-height:1.75}.body p{margin:0 0 1.25rem}.footer{border-top:1px solid #eee;margin-top:28px;padding-top:18px;color:#666;font-size:.9rem}.footer a{color:#991b1b}</style>
</head>
<body>
  <header><div class="wrap"><a href="/">DIÁRIO RUBRO-NEGRO</a></div></header>
  <main class="wrap">
    <article class="article">
      <span class="category">${escapeHtml(news.category || 'Notícias')}</span>
      <h1>${escapeHtml(title)}</h1>
      <div class="meta">Por <a href="/redacao">Redação DRN</a> · Publicado em <time datetime="${escapeHtml(published)}">${escapeHtml(formatDate(published))}</time></div>
      ${image ? `<img class="hero" src="${escapeHtml(image)}" alt="${escapeHtml(title)}" />` : ''}
      <div class="body">${paragraphs}</div>
      <div class="footer">Conteúdo editorial do Diário Rubro-Negro. <a href="/">Voltar para as notícias</a>.</div>
    </article>
  </main>
</body>
</html>`;

    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=600');
    return response.status(200).send(html);
  } catch (error) {
    console.error('article route error', error);
    return response.status(500).send('Não foi possível carregar a notícia');
  }
}
