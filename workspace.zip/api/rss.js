const ALLOWED_HOSTS = new Set([
  'ge.globo.com',
  'www.espn.com.br',
  'rss.uol.com.br',
  'www.lance.com.br',
  'www.goal.com',
  'www.terra.com.br',
  'odia.ig.com.br',
  'colunadofla.com',
  'www.colunadofla.com',
  'news.google.com',
]);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function decodeXml(value = '') {
  const withoutCdata = value.replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/i, '$1');

  return withoutCdata
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&#39;/gi, "'")
    .trim();
}

function tagText(xml, tag) {
  const safeTag = escapeRegExp(tag);
  const match = xml.match(new RegExp(`<${safeTag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${safeTag}>`, 'i'));
  return match ? decodeXml(match[1]) : '';
}

function tagAttr(xml, tag, attr) {
  const safeTag = escapeRegExp(tag);
  const safeAttr = escapeRegExp(attr);
  const match = xml.match(new RegExp(`<${safeTag}\\b[^>]*\\b${safeAttr}=["']([^"']+)["'][^>]*>`, 'i'));
  return match ? decodeXml(match[1]) : '';
}

function extractImage(html = '') {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? decodeXml(match[1]) : '';
}

function parseFeed(xml) {
  const channelMatch = xml.match(/<channel\b[^>]*>([\s\S]*?)<\/channel>/i);
  const feedRoot = channelMatch ? channelMatch[1] : xml;
  const feedTitle = tagText(feedRoot, 'title') || 'Fonte RSS';

  const rssItems = [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map((match) => match[1]);
  if (rssItems.length > 0) {
    return {
      title: feedTitle,
      items: rssItems.map((item) => {
        const description = tagText(item, 'description');
        const content = tagText(item, 'content:encoded') || tagText(item, 'content') || description;
        const enclosure = tagAttr(item, 'enclosure', 'url');
        const mediaThumbnail = tagAttr(item, 'media:thumbnail', 'url');
        const mediaContent = tagAttr(item, 'media:content', 'url');

        return {
          title: tagText(item, 'title'),
          description,
          content,
          link: tagText(item, 'link') || tagText(item, 'guid'),
          pubDate: tagText(item, 'pubDate') || tagText(item, 'dc:date') || new Date().toISOString(),
          thumbnail: mediaThumbnail || mediaContent || enclosure || extractImage(content || description),
          enclosure: enclosure ? { link: enclosure } : undefined,
        };
      }).filter((item) => item.title),
    };
  }

  const atomEntries = [...xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)].map((match) => match[1]);
  return {
    title: tagText(xml, 'title') || feedTitle,
    items: atomEntries.map((entry) => {
      const description = tagText(entry, 'summary');
      const content = tagText(entry, 'content') || description;
      const link = tagAttr(entry, 'link', 'href') || tagText(entry, 'link');
      const mediaThumbnail = tagAttr(entry, 'media:thumbnail', 'url');
      const mediaContent = tagAttr(entry, 'media:content', 'url');

      return {
        title: tagText(entry, 'title'),
        description,
        content,
        link,
        pubDate: tagText(entry, 'updated') || tagText(entry, 'published') || new Date().toISOString(),
        thumbnail: mediaThumbnail || mediaContent || extractImage(content || description),
      };
    }).filter((item) => item.title),
  };
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ status: 'error', message: 'Método não permitido' });
  }

  const rawUrl = Array.isArray(request.query?.url) ? request.query.url[0] : request.query?.url;

  if (!rawUrl) {
    return response.status(400).json({ status: 'error', message: 'URL do feed não informada' });
  }

  let feedUrl;
  try {
    feedUrl = new URL(rawUrl);
  } catch {
    return response.status(400).json({ status: 'error', message: 'URL do feed inválida' });
  }

  if (feedUrl.protocol !== 'https:' || !ALLOWED_HOSTS.has(feedUrl.hostname)) {
    return response.status(403).json({ status: 'error', message: 'Fonte de notícias não permitida' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const upstream = await fetch(feedUrl.toString(), {
      signal: controller.signal,
      headers: {
        Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
        'User-Agent': 'DiarioRubroNegro/1.0 (+https://vercel.app)',
      },
      redirect: 'follow',
    });

    if (!upstream.ok) {
      return response.status(502).json({
        status: 'error',
        message: `A fonte respondeu com HTTP ${upstream.status}`,
      });
    }

    const xml = await upstream.text();
    const parsed = parseFeed(xml);

    response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return response.status(200).json({
      status: 'ok',
      feed: { title: parsed.title },
      items: parsed.items.slice(0, 20),
    });
  } catch (error) {
    const message = error?.name === 'AbortError'
      ? 'Tempo limite ao consultar a fonte'
      : 'Não foi possível consultar a fonte';

    return response.status(502).json({ status: 'error', message });
  } finally {
    clearTimeout(timeout);
  }
}
