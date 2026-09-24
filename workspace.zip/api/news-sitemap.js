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

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).send('Método não permitido');
  }

  try {
    const { url, key } = config();
    const params = new URLSearchParams({
      status: 'eq.published',
      select: 'id,title,published_at,created_at',
      order: 'created_at.desc',
      limit: '1000',
    });

    const upstream = await fetch(`${url}/rest/v1/news?${params.toString()}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!upstream.ok) throw new Error(`Supabase HTTP ${upstream.status}`);

    const cutoff = Date.now() - 48 * 60 * 60 * 1000;
    const base = origin(request);
    const rows = (await upstream.json()).filter((item) => {
      const published = item.published_at || item.created_at;
      return published && new Date(published).getTime() >= cutoff;
    });

    const urls = rows.map((item) => {
      const published = item.published_at || item.created_at;
      return `  <url>
    <loc>${xml(`${base}/noticias/${encodeURIComponent(item.id)}`)}</loc>
    <news:news>
      <news:publication>
        <news:name>Diário Rubro-Negro</news:name>
        <news:language>pt</news:language>
      </news:publication>
      <news:publication_date>${xml(new Date(published).toISOString())}</news:publication_date>
      <news:title>${xml(item.title)}</news:title>
    </news:news>
  </url>`;
    }).join('\n');

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

    response.setHeader('Content-Type', 'application/xml; charset=utf-8');
    response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=900');
    return response.status(200).send(body);
  } catch (error) {
    console.error('news sitemap error', error);
    return response.status(500).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>');
  }
}
