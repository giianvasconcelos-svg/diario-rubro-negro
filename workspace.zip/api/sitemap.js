function config() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase não configurado');
  return { url: url.replace(/\/$/, ''), key };
}

function origin(request) {
  const host = request.headers['x-forwarded-host'] || request.headers.host;
  const proto = request.headers['x-forwarded-proto'] || 'https';
  return `${proto}://${host}`;
}

function xml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlNode(loc, lastmod, changefreq = 'weekly', priority = '0.6') {
  return `  <url>\n    <loc>${xml(loc)}</loc>${lastmod ? `\n    <lastmod>${xml(lastmod)}</lastmod>` : ''}\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).send('Método não permitido');
  }

  const base = origin(request);
  const staticPages = [
    ['/', 'daily', '1.0'],
    ['/sobre', 'monthly', '0.6'],
    ['/contato', 'monthly', '0.5'],
    ['/redacao', 'monthly', '0.6'],
    ['/privacidade', 'monthly', '0.4'],
    ['/cookies', 'monthly', '0.4'],
    ['/termos', 'monthly', '0.4'],
  ].map(([path, freq, priority]) => urlNode(`${base}${path}`, null, freq, priority));

  try {
    const { url, key } = config();
    const params = new URLSearchParams({
      status: 'eq.published',
      select: 'id,updated_at,published_at,created_at',
      order: 'created_at.desc',
      limit: '5000',
    });

    const upstream = await fetch(`${url}/rest/v1/news?${params.toString()}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!upstream.ok) throw new Error(`Supabase HTTP ${upstream.status}`);

    const rows = await upstream.json();
    const articles = rows.map((item) => {
      const modified = item.updated_at || item.published_at || item.created_at;
      return urlNode(
        `${base}/noticias/${encodeURIComponent(item.id)}`,
        modified ? new Date(modified).toISOString() : null,
        'weekly',
        '0.8'
      );
    });

    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...staticPages, ...articles].join('\n')}\n</urlset>`;
    response.setHeader('Content-Type', 'application/xml; charset=utf-8');
    response.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
    return response.status(200).send(body);
  } catch (error) {
    console.error('general sitemap error', error);
    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticPages.join('\n')}\n</urlset>`;
    response.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return response.status(200).send(body);
  }
}
