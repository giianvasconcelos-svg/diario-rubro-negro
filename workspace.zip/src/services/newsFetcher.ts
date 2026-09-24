// Serviço de busca automática de notícias reais sobre o Flamengo
// Usa APIs públicas e RSS feeds para buscar notícias em tempo real

export interface FetchedNews {
  title: string;
  description: string;
  content: string;
  link: string;
  source: string;
  pubDate: string;
  thumbnail?: string;
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'api';
  enabled: boolean;
  icon: string;
}

// ============ FONTES DE NOTÍCIAS ============

export const defaultSources: NewsSource[] = [
  {
    id: 'ge-globo',
    name: 'GE Globo - Flamengo',
    url: 'https://ge.globo.com/rss/futebol/times/flamengo/',
    type: 'rss',
    enabled: true,
    icon: '🟢'
  },
  {
    id: 'espn',
    name: 'ESPN Brasil',
    url: 'https://www.espn.com.br/rss/futebol/flamengo',
    type: 'rss',
    enabled: true,
    icon: '🔴'
  },
  {
    id: 'uol',
    name: 'UOL Esporte',
    url: 'https://rss.uol.com.br/feed/esporte.htm',
    type: 'rss',
    enabled: true,
    icon: '🟡'
  },
  {
    id: 'lance',
    name: 'Lance!',
    url: 'https://www.lance.com.br/rss/flamengo.xml',
    type: 'rss',
    enabled: true,
    icon: '⚪'
  },
  {
    id: 'goal',
    name: 'Goal Brasil',
    url: 'https://www.goal.com/pt-br/rss',
    type: 'rss',
    enabled: true,
    icon: '🔵'
  },
  {
    id: 'terra',
    name: 'Terra Esportes',
    url: 'https://www.terra.com.br/esportes/futebol/flamengo/rss',
    type: 'rss',
    enabled: true,
    icon: '🟠'
  },
  {
    id: 'odia',
    name: 'O Dia - Flamengo',
    url: 'https://odia.ig.com.br/esporte/flamengo',
    type: 'rss',
    enabled: true,
    icon: '🟣'
  },
  {
    id: 'colunadofla',
    name: 'Coluna do Fla',
    url: 'https://colunadofla.com/',
    type: 'rss',
    enabled: true,
    icon: '⚫'
  }
];

// ============ PROXY CORS ============
// Usamos serviços de proxy para contornar restrições CORS do browser

const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
];

// ============ BUSCA VIA RSS2JSON (Método Principal) ============

export async function fetchFromRSS2JSON(rssUrl: string): Promise<FetchedNews[]> {
  const apiKey = ''; // Gratuito até 10.000 req/dia sem chave
  const apiUrl = `/api/rss?url=${encodeURIComponent(rssUrl)}`;
  
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Falha na requisição');
    
    const data = await response.json();
    
    if (data.status !== 'ok' || !data.items) {
      return [];
    }
    
    return data.items.map((item: any) => ({
      title: cleanHTML(item.title || ''),
      description: cleanHTML(item.description || ''),
      content: cleanHTML(item.content || item.description || ''),
      link: item.link || '',
      source: data.feed?.title || 'Fonte RSS',
      pubDate: item.pubDate || new Date().toISOString(),
      thumbnail: item.thumbnail || item.enclosure?.link || extractImageFromContent(item.content || item.description || '')
    }));
  } catch (error) {
    console.error('Erro ao buscar RSS2JSON:', error);
    return [];
  }
}

// ============ BUSCA DIRETA COM PROXY CORS ============

export async function fetchWithProxy(url: string): Promise<string> {
  for (const proxy of CORS_PROXIES) {
    try {
      const response = await fetch(`${proxy}${encodeURIComponent(url)}`);
      if (response.ok) {
        return await response.text();
      }
    } catch (error) {
      continue;
    }
  }
  throw new Error('Todos os proxies falharam');
}

export async function fetchRSSDirect(rssUrl: string): Promise<FetchedNews[]> {
  try {
    const xmlText = await fetchWithProxy(rssUrl);
    return parseRSS(xmlText);
  } catch (error) {
    console.error('Erro ao buscar RSS direto:', error);
    return [];
  }
}

// ============ PARSER DE RSS ============

function parseRSS(xmlText: string): FetchedNews[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  
  // RSS 2.0
  const items = xmlDoc.querySelectorAll('item');
  if (items.length > 0) {
    return Array.from(items).map(item => ({
      title: cleanHTML(item.querySelector('title')?.textContent || ''),
      description: cleanHTML(item.querySelector('description')?.textContent || ''),
      content: cleanHTML(item.querySelector('content\\:encoded, content')?.textContent || 
                         item.querySelector('description')?.textContent || ''),
      link: item.querySelector('link')?.textContent || '',
      source: xmlDoc.querySelector('channel > title')?.textContent || 'RSS Feed',
      pubDate: item.querySelector('pubDate')?.textContent || new Date().toISOString(),
      thumbnail: extractImageFromRSS(item)
    }));
  }
  
  // Atom
  const entries = xmlDoc.querySelectorAll('entry');
  return Array.from(entries).map(entry => ({
    title: cleanHTML(entry.querySelector('title')?.textContent || ''),
    description: cleanHTML(entry.querySelector('summary')?.textContent || ''),
    content: cleanHTML(entry.querySelector('content')?.textContent || 
                       entry.querySelector('summary')?.textContent || ''),
    link: entry.querySelector('link')?.getAttribute('href') || '',
    source: xmlDoc.querySelector('feed > title')?.textContent || 'Atom Feed',
    pubDate: entry.querySelector('updated, published')?.textContent || new Date().toISOString(),
    thumbnail: entry.querySelector('media\\:thumbnail, thumbnail')?.getAttribute('url') || ''
  }));
}

function extractImageFromRSS(item: Element): string {
  // Tentar media:content
  const mediaContent = item.querySelector('media\\:content, content[type^="image"]');
  if (mediaContent) {
    return mediaContent.getAttribute('url') || '';
  }
  
  // Tentar enclosure
  const enclosure = item.querySelector('enclosure[type^="image"]');
  if (enclosure) {
    return enclosure.getAttribute('url') || '';
  }
  
  // Tentar extrair do conteúdo
  const content = item.querySelector('content\\:encoded, description')?.textContent || '';
  return extractImageFromContent(content);
}

function extractImageFromContent(html: string): string {
  const match = html.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : '';
}

// ============ LIMPEZA DE HTML ============

function cleanHTML(html: string): string {
  // Remover tags HTML
  let text = html.replace(/<[^>]*>/g, ' ');
  // Decodificar entidades
  text = text.replace(/&nbsp;/g, ' ')
             .replace(/&amp;/g, '&')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/&quot;/g, '"')
             .replace(/&#39;/g, "'")
             .replace(/&hellip;/g, '...');
  // Remover espaços extras
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

// ============ BUSCA COMPLETA ============

export async function fetchAllNews(sources: NewsSource[] = defaultSources): Promise<FetchedNews[]> {
  const enabledSources = sources.filter(s => s.enabled);
  const allNews: FetchedNews[] = [];
  
  // Buscar de todas as fontes em paralelo
  const promises = enabledSources.map(async (source) => {
    try {
      // Tentar RSS2JSON primeiro (mais confiável)
      let news = await fetchFromRSS2JSON(source.url);
      
      // Se falhar, tentar proxy direto
      if (news.length === 0) {
        news = await fetchRSSDirect(source.url);
      }
      
      // Marcar com a fonte
      return news.map(n => ({ ...n, source: source.name }));
    } catch (error) {
      console.error(`Erro ao buscar ${source.name}:`, error);
      return [];
    }
  });
  
  const results = await Promise.allSettled(promises);
  
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      allNews.push(...result.value);
    }
  });
  
  // Filtrar apenas notícias sobre o Flamengo
  const flamengoNews = filterFlamengoNews(allNews);
  
  // Remover duplicatas
  const uniqueNews = removeDuplicates(flamengoNews);
  
  // Ordenar por data (mais recente primeiro)
  uniqueNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  
  return uniqueNews;
}

// ============ FILTRAR NOTÍCIAS DO FLAMENGO ============

function filterFlamengoNews(news: FetchedNews[]): FetchedNews[] {
  const keywords = [
    'flamengo', 'fla', 'rubro-negro', 'rubro negro', 'mengão',
    'mengao', 'urubu', 'maracanã', 'maracana', 'gávea', 'gavea',
    'ninho do urubu', 'ninho', 'arrascaeta', 'gabigol', 'gabriel barbos',
    'pedro guilherme', 'everton ribeiro', 'gerson', 'bruno henrique',
    'crf', 'clube de regatas'
  ];
  
  return news.filter(item => {
    const text = `${item.title} ${item.description} ${item.content}`.toLowerCase();
    return keywords.some(keyword => text.includes(keyword));
  });
}

// ============ REMOVER DUPLICATAS ============

function removeDuplicates(news: FetchedNews[]): FetchedNews[] {
  const seen = new Set<string>();
  return news.filter(item => {
    // Normalizar título para comparação
    const normalizedTitle = item.title.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 50);
    
    if (seen.has(normalizedTitle)) {
      return false;
    }
    seen.add(normalizedTitle);
    return true;
  });
}

// ============ BUSCA COM API EXTERNA (NewsAPI alternativa) ============

export async function fetchFromGNewsAPI(query: string = 'Flamengo', apiKey?: string): Promise<FetchedNews[]> {
  // GNews API - Gratuito com limite
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=pt&country=br&max=10&apikey=${apiKey || 'demo'}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    
    const data = await response.json();
    
    return (data.articles || []).map((article: any) => ({
      title: article.title || '',
      description: article.description || '',
      content: article.content || article.description || '',
      link: article.url || '',
      source: article.source?.name || 'GNews',
      pubDate: article.publishedAt || new Date().toISOString(),
      thumbnail: article.image || ''
    }));
  } catch (error) {
    console.error('Erro ao buscar GNews API:', error);
    return [];
  }
}

// ============ BUSCA VIA GOOGLE NEWS RSS ============

export async function fetchFromGoogleNews(query: string = 'Flamengo'): Promise<FetchedNews[]> {
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
  
  try {
    const news = await fetchFromRSS2JSON(rssUrl);
    return news.map(n => ({ ...n, source: 'Google News' }));
  } catch (error) {
    return [];
  }
}

// ============ BUSCA VIA SCRAPING HTML ============

export async function fetchFromHTMLScraping(url: string, sourceName: string): Promise<FetchedNews[]> {
  try {
    const htmlText = await fetchWithProxy(url);
    return parseHTMLForNews(htmlText, url, sourceName);
  } catch (error) {
    console.error(`Erro ao buscar HTML de ${sourceName}:`, error);
    return [];
  }
}

function parseHTMLForNews(html: string, baseUrl: string, sourceName: string): FetchedNews[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const news: FetchedNews[] = [];
  
  // Tentar encontrar artigos por seletores comuns
  const articleSelectors = [
    'article',
    '.news-item',
    '.post-item',
    '.article-item',
    '[itemtype="http://schema.org/NewsArticle"]',
    '.manchete',
    '.noticia',
    '.post'
  ];
  
  let articles: Element[] = [];
  for (const selector of articleSelectors) {
    const found = doc.querySelectorAll(selector);
    if (found.length > 0) {
      articles = Array.from(found);
      break;
    }
  }
  
  // Se não encontrou por seletores, tentar por links
  if (articles.length === 0) {
    const links = doc.querySelectorAll('a[href]');
    articles = Array.from(links).filter(link => {
      const href = link.getAttribute('href') || '';
      const text = link.textContent || '';
      return (
        (href.includes('noticia') || href.includes('news') || href.includes('post') || href.includes('flamengo')) &&
        text.length > 20 &&
        text.length < 200
      );
    });
  }
  
  // Extrair informações dos artigos
  articles.slice(0, 20).forEach(article => {
    try {
      // Título
      const titleEl = article.querySelector('h1, h2, h3, .title, .titulo, a');
      const title = titleEl?.textContent?.trim() || '';
      
      if (title.length < 10 || title.length > 200) return;
      
      // Descrição
      const descEl = article.querySelector('p, .description, .resumo, .excerpt, .subtitle');
      const description = descEl?.textContent?.trim() || title;
      
      // Link
      const linkEl = article.querySelector('a[href]');
      let link = linkEl?.getAttribute('href') || '';
      if (link && !link.startsWith('http')) {
        link = new URL(link, baseUrl).toString();
      }
      
      // Imagem
      const imgEl = article.querySelector('img');
      const thumbnail = imgEl?.getAttribute('src') || '';
      
      // Data
      const timeEl = article.querySelector('time, .date, .data, [datetime]');
      const pubDate = timeEl?.getAttribute('datetime') || timeEl?.textContent || new Date().toISOString();
      
      if (title && (link || title.length > 20)) {
        news.push({
          title: cleanHTML(title),
          description: cleanHTML(description),
          content: cleanHTML(description),
          link: link || baseUrl,
          source: sourceName,
          pubDate: pubDate,
          thumbnail: thumbnail
        });
      }
    } catch (e) {
      // Ignorar erros em artigos individuais
    }
  });
  
  return news;
}

// ============ BUSCA ESPECÍFICA POR FONTE ============

export async function fetchFromODia(): Promise<FetchedNews[]> {
  const url = 'https://odia.ig.com.br/esporte/flamengo';
  
  // Tentar RSS primeiro
  const rssUrls = [
    'https://odia.ig.com.br/rss/esporte/flamengo.xml',
    'https://odia.ig.com.br/esporte/flamengo/rss',
    'https://odia.ig.com.br/feed/esporte/flamengo'
  ];
  
  for (const rssUrl of rssUrls) {
    try {
      const news = await fetchFromRSS2JSON(rssUrl);
      if (news.length > 0) {
        return news.map(n => ({ ...n, source: 'O Dia - Flamengo' }));
      }
    } catch (e) {
      continue;
    }
  }
  
  // Fallback: scraping HTML
  return fetchFromHTMLScraping(url, 'O Dia - Flamengo');
}

export async function fetchFromColunaDoFla(): Promise<FetchedNews[]> {
  const url = 'https://colunadofla.com/';
  
  // Tentar RSS primeiro
  const rssUrls = [
    'https://colunadofla.com/feed',
    'https://colunadofla.com/rss',
    'https://colunadofla.com/feed/rss'
  ];
  
  for (const rssUrl of rssUrls) {
    try {
      const news = await fetchFromRSS2JSON(rssUrl);
      if (news.length > 0) {
        return news.map(n => ({ ...n, source: 'Coluna do Fla' }));
      }
    } catch (e) {
      continue;
    }
  }
  
  // Fallback: scraping HTML
  return fetchFromHTMLScraping(url, 'Coluna do Fla');
}

// ============ BUSCA COMPLETA COM TODAS AS FONTES ============

export async function fetchAllNewsComplete(): Promise<FetchedNews[]> {
  // Buscar de todas as fontes em paralelo
  const [rssNews, googleNews, odiaNews, colunaDoFlaNews] = await Promise.allSettled([
    fetchAllNews(defaultSources.filter(s => s.id !== 'odia' && s.id !== 'colunadofla')),
    fetchFromGoogleNews('Flamengo futebol'),
    fetchFromODia(),
    fetchFromColunaDoFla()
  ]);
  
  const allNews: FetchedNews[] = [];
  
  if (rssNews.status === 'fulfilled') {
    allNews.push(...rssNews.value);
  }
  
  if (googleNews.status === 'fulfilled') {
    allNews.push(...googleNews.value);
  }
  
  if (odiaNews.status === 'fulfilled') {
    allNews.push(...odiaNews.value);
  }
  
  if (colunaDoFlaNews.status === 'fulfilled') {
    allNews.push(...colunaDoFlaNews.value);
  }
  
  // Remover duplicatas finais
  return removeDuplicates(allNews);
}

// ============ VERIFICAR STATUS DAS FONTES ============

export async function checkSourcesStatus(sources: NewsSource[] = defaultSources): Promise<Record<string, boolean>> {
  const status: Record<string, boolean> = {};
  
  const checks = sources.map(async (source) => {
    try {
      const news = await fetchFromRSS2JSON(source.url);
      status[source.id] = news.length > 0;
    } catch {
      status[source.id] = false;
    }
  });
  
  await Promise.allSettled(checks);
  return status;
}
