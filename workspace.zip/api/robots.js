function origin(request) {
  const host = request.headers['x-forwarded-host'] || request.headers.host;
  const proto = request.headers['x-forwarded-proto'] || 'https';
  return `${proto}://${host}`;
}

export default function handler(request, response) {
  const base = origin(request);
  const body = `User-agent: *\nAllow: /\nDisallow: /admin\n\nUser-agent: Googlebot-News\nAllow: /\n\nSitemap: ${base}/sitemap.xml\nSitemap: ${base}/news-sitemap.xml\n`;
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  return response.status(200).send(body);
}
