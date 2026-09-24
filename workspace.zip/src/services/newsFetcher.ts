// Serviço de busca automática de notícias reais sobre o Flamengo
// As origens são usadas apenas para apuração interna. O conteúdo público é assinado pela Redação DRN.

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

const EDITORIAL_SOURCE = 'Redação DRN';

export const defaultSources: NewsSource[] = [
  { id: 'ge-globo', name: 'GE Globo - Flamengo', url: 'https://ge.globo.com/rss/futebol/times/flamengo/', type: 'rss', enabled: true, icon: '🟢' },
  { id: 'espn', name: 'ESPN Brasil', url: 'https://www.espn.com.br/rss/futebol/flamengo', type: 'rss', enabled: true, icon: '🔴' },
  { id: 'uol', name: 'UOL Esporte', url: 'https://rss.uol.com.br/feed/esporte.htm', type: 'rss', enabled: true, icon: '🟡' },
  { id: 'lance', name: 'Lance!', url: 'https://www.lance.com.br/rss/flamengo.xml', type: 'rss', enabled: true, icon: '⚪' },
  { id: 'goal', name: 'Goal Brasil', url: 'https://www.goal.com/pt-br/rss', type: 'rss', enabled: true, icon: '🔵' },
  { id: 'terra', name: 'Terra Esportes', url: 'https://www.terra.com.br/esportes/futebol/flamengo/rss', type: 'rss', enabled: true, icon: '🟠' },
  { id: 'odia', name: 'O Dia - Flamengo', url: 'https://odia.ig.com.br/esporte/flamengo', type: 'rss', enabled: true, icon: '🟣' },
  { id: 'colunadofla', name: 'Coluna do Fla', url: 'https://colunadofla.com/', type: 'rss', enabled: true, icon: '⚫' },
  { id: 'x-renanmoura1989', name: 'X - @renanmoura1989', url: 'https://x.com/renanmoura1989', type: 'api', enabled: true, icon: '𝕏' },
  { id: 'x-futebol-info', name: 'X - @futebol_info', url: 'https://x.com/futebol_info', type: 'api', enabled: true, icon: '𝕏' },
];

function cleanHTML(html: string): string {
  return String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&hellip;/g, '...')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractImageFromContent(html: string): string {
  const match = String(html || '').match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : '';
}

export async function fetchFromRSS2JSON(rssUrl: string): Promise<FetchedNews[]> {
  const apiUrl = `/api/rss?url=${encodeURIComponent(rssUrl)}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) return [];
    const data = await response.json();
    if (data.status !== 'ok' || !Array.isArray(data.items)) return [];

    return data.items.map((item: any) => ({
      title: cleanHTML(item.title || ''),
      description: cleanHTML(item.description || ''),
      content: cleanHTML(item.content || item.description || ''),
      link: item.link || '',
      source: EDITORIAL_SOURCE,
      pubDate: item.pubDate || new Date().toISOString(),
      thumbnail: item.thumbnail || item.enclosure?.link || extractImageFromContent(item.content || item.description || ''),
    }));
  } catch (error) {
    console.error('Erro ao consultar feed:', error);
    return [];
  }
}

async function fetchFirstWorkingFeed(urls: string[]): Promise<FetchedNews[]> {
  for (const url of urls) {
    const news = await fetchFromRSS2JSON(url);
    if (news.length > 0) return news;
  }
  return [];
}

export async function fetchFromODia(): Promise<FetchedNews[]> {
  return fetchFirstWorkingFeed([
    'https://odia.ig.com.br/rss/esporte/flamengo.xml',
    'https://odia.ig.com.br/esporte/flamengo/rss',
    'https://odia.ig.com.br/feed/esporte/flamengo',
  ]);
}

export async function fetchFromColunaDoFla(): Promise<FetchedNews[]> {
  return fetchFirstWorkingFeed([
    'https://colunadofla.com/feed',
    'https://colunadofla.com/rss',
    'https://colunadofla.com/feed/rss',
  ]);
}

export async function fetchFromXAccount(username: string): Promise<FetchedNews[]> {
  try {
    const response = await fetch('/api/x-sources');
    if (!response.ok) return [];
    const data = await response.json();
    if (data.status !== 'ok' || !Array.isArray(data.items)) return [];

    return data.items
      .filter((item: any) => String(item.username || '').toLowerCase() === username.toLowerCase())
      .filter((item: any) => String(item.text || '').toLowerCase().includes('flamengo'))
      .map((item: any) => ({
        title: cleanHTML(String(item.text || '').slice(0, 180)),
        description: cleanHTML(item.text || ''),
        content: cleanHTML(item.text || ''),
        link: item.url || '',
        source: EDITORIAL_SOURCE,
        pubDate: item.createdAt || new Date().toISOString(),
        thumbnail: '',
      }));
  } catch (error) {
    console.error(`Erro ao consultar X @${username}:`, error);
    return [];
  }
}

async function fetchSource(source: NewsSource): Promise<FetchedNews[]> {
  if (source.id === 'odia') return fetchFromODia();
  if (source.id === 'colunadofla') return fetchFromColunaDoFla();
  if (source.id === 'x-renanmoura1989') return fetchFromXAccount('renanmoura1989');
  if (source.id === 'x-futebol-info') return fetchFromXAccount('futebol_info');
  return fetchFromRSS2JSON(source.url);
}

function filterFlamengoNews(news: FetchedNews[]): FetchedNews[] {
  const keywords = [
    'flamengo', 'fla', 'rubro-negro', 'rubro negro', 'mengão', 'mengao',
    'urubu', 'maracanã', 'maracana', 'gávea', 'gavea', 'ninho do urubu',
    'arrascaeta', 'pedro guilherme', 'gerson', 'bruno henrique', 'crf',
    'clube de regatas',
  ];

  return news.filter((item) => {
    const text = `${item.title} ${item.description} ${item.content}`.toLowerCase();
    return keywords.some((keyword) => text.includes(keyword));
  });
}

function removeDuplicates(news: FetchedNews[]): FetchedNews[] {
  const seen = new Set<string>();
  return news.filter((item) => {
    const normalized = item.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '').slice(0, 70);
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

function sortNewestFirst(news: FetchedNews[]): FetchedNews[] {
  return [...news].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}

export async function fetchAllNews(sources: NewsSource[] = defaultSources): Promise<FetchedNews[]> {
  const enabled = sources.filter((source) => source.enabled);
  const results = await Promise.allSettled(enabled.map(fetchSource));
  const allNews = results.flatMap((result) => result.status === 'fulfilled' ? result.value : []);
  return sortNewestFirst(removeDuplicates(filterFlamengoNews(allNews))).map((item) => ({ ...item, source: EDITORIAL_SOURCE }));
}

export async function fetchFromGoogleNews(query: string = 'Flamengo'): Promise<FetchedNews[]> {
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
  const news = await fetchFromRSS2JSON(rssUrl);
  return news.map((item) => ({ ...item, source: EDITORIAL_SOURCE }));
}

export async function fetchFromGNewsAPI(query: string = 'Flamengo', apiKey?: string): Promise<FetchedNews[]> {
  if (!apiKey) return [];
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=pt&country=br&max=10&apikey=${encodeURIComponent(apiKey)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return (data.articles || []).map((article: any) => ({
      title: cleanHTML(article.title || ''),
      description: cleanHTML(article.description || ''),
      content: cleanHTML(article.content || article.description || ''),
      link: article.url || '',
      source: EDITORIAL_SOURCE,
      pubDate: article.publishedAt || new Date().toISOString(),
      thumbnail: article.image || '',
    }));
  } catch {
    return [];
  }
}

export async function fetchAllNewsComplete(): Promise<FetchedNews[]> {
  const [sourcesResult, googleResult] = await Promise.allSettled([
    fetchAllNews(defaultSources),
    fetchFromGoogleNews('Flamengo futebol'),
  ]);

  const combined: FetchedNews[] = [];
  if (sourcesResult.status === 'fulfilled') combined.push(...sourcesResult.value);
  if (googleResult.status === 'fulfilled') combined.push(...googleResult.value);

  return sortNewestFirst(removeDuplicates(filterFlamengoNews(combined))).map((item) => ({ ...item, source: EDITORIAL_SOURCE }));
}

export async function checkSourcesStatus(sources: NewsSource[] = defaultSources): Promise<Record<string, boolean>> {
  const status: Record<string, boolean> = {};
  const results = await Promise.allSettled(sources.map(async (source) => ({ source, news: await fetchSource(source) })));

  results.forEach((result) => {
    if (result.status === 'fulfilled') status[result.value.source.id] = result.value.news.length > 0;
  });
  sources.forEach((source) => { if (!(source.id in status)) status[source.id] = false; });
  return status;
}
