import { useState, useEffect } from 'react';

// ============ DADOS ============
const mainNews = {
  id: 1,
  title: "Flamengo domina o jogo e vence clássico por 3 a 1 no Maracanã lotado",
  excerpt: "Rubro-Negro carioca fez uma partida impecável e conquistou mais uma vitória importante no Campeonato Brasileiro.",
  image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200",
  category: "Jogos",
  date: "Há 2 horas",
  author: "Carlos Mendes"
};

const classification = [
  { pos: 1, team: "Flamengo", pts: 38, w: 12, d: 2, l: 1 },
  { pos: 2, team: "Palmeiras", pts: 35, w: 11, d: 2, l: 2 },
  { pos: 3, team: "Botafogo", pts: 33, w: 10, d: 3, l: 2 },
  { pos: 4, team: "Fortaleza", pts: 31, w: 9, d: 4, l: 2 },
  { pos: 5, team: "São Paulo", pts: 29, w: 8, d: 5, l: 2 },
];

// ============ REFORMULADOR ============
const synonyms = {
  'flamengo': ['Rubro-Negro', 'time da Gávea', 'Mais Querido', 'equipe carioca'],
  'jogador': ['atleta', 'craque', 'profissional'],
  'jogo': ['partida', 'confronto', 'embate'],
  'vitória': ['triunfo', 'sucesso', 'resultado positivo'],
  'gol': ['balão na rede', 'marcação', 'tentativa convertida'],
  'torcida': ['Nação', 'fiel torcida', 'apoiadores'],
  'maracanã': ['templo do futebol', 'Maraca', 'estádio'],
};

function reformulateText(text: string): string {
  let result = text;
  Object.entries(synonyms).forEach(([word, alts]) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    result = result.replace(regex, () => alts[Math.floor(Math.random() * alts.length)]);
  });
  return result;
}

// ============ BUSCA DE NOTÍCIAS ============
interface NewsItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  thumbnail?: string;
  source: string;
}

async function fetchNews(): Promise<NewsItem[]> {
  const rssUrl = 'https://news.google.com/rss/search?q=Flamengo+futebol&hl=pt-BR&gl=BR&ceid=BR:pt-419';
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=20`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.status === 'ok' && data.items) {
      return data.items.map((item: any) => ({
        title: item.title || '',
        description: (item.description || '').replace(/<[^>]*>/g, '').substring(0, 200),
        link: item.link || '',
        pubDate: item.pubDate || new Date().toISOString(),
        thumbnail: item.thumbnail || item.enclosure?.link || '',
        source: 'Google News'
      }));
    }
    return [];
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return [];
  }
}

// ============ APP ============
export default function App() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNews, setSelectedNews] = useState<Set<number>>(new Set());
  const [showAdmin, setShowAdmin] = useState(false);
  const [publishedNews, setPublishedNews] = useState<any[]>([]);

  const handleFetchNews = async () => {
    setLoading(true);
    const fetchedNews = await fetchNews();
    setNews(fetchedNews);
    setSelectedNews(new Set(fetchedNews.map((_, i) => i)));
    setLoading(false);
  };

  const handleImportSelected = () => {
    const imported = Array.from(selectedNews).map(idx => {
      const original = news[idx];
      return {
        id: Date.now() + idx,
        title: reformulateText(original.title),
        excerpt: reformulateText(original.description),
        content: reformulateText(original.description),
        category: 'Jogos',
        image: original.thumbnail || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
        date: new Date(original.pubDate).toLocaleDateString('pt-BR'),
        tags: ['Flamengo']
      };
    });
    setPublishedNews(prev => [...imported, ...prev]);
    setShowAdmin(false);
    alert(`${imported.length} notícias importadas com sucesso!`);
  };

  useEffect(() => {
    const saved = localStorage.getItem('drn_published');
    if (saved) setPublishedNews(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (publishedNews.length > 0) {
      localStorage.setItem('drn_published', JSON.stringify(publishedNews));
    }
  }, [publishedNews]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl font-black text-red-700">DR</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white">DIÁRIO RUBRO-NEGRO</h1>
                <p className="text-red-100 text-xs">Tudo sobre o Flamengo</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAdmin(true)}
              className="bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 flex items-center justify-center text-white"
            >
              <i className="fas fa-cog"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Hero */}
        <div className="relative rounded-xl overflow-hidden shadow-xl mb-6">
          <img src={mainNews.image} alt={mainNews.title} className="w-full h-96 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">{mainNews.category}</span>
            <h2 className="text-3xl font-bold text-white mt-3">{mainNews.title}</h2>
            <p className="text-gray-200 mt-2">{mainNews.excerpt}</p>
          </div>
        </div>

        {/* Published News */}
        {publishedNews.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-green-600 rounded-full"></span>
              Notícias Publicadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publishedNews.slice(0, 6).map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded">{item.category}</span>
                    <h3 className="font-bold text-gray-800 mt-2 line-clamp-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.excerpt}</p>
                    <span className="text-gray-400 text-xs mt-2"><i className="far fa-clock mr-1"></i>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Classification */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-red-700 to-red-600 px-4 py-3">
            <h3 className="text-white font-bold flex items-center gap-2">
              <i className="fas fa-trophy"></i> Classificação - Brasileirão
            </h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">#</th>
                <th className="py-2 px-4 text-left">Time</th>
                <th className="py-2 px-4 text-center">P</th>
                <th className="py-2 px-4 text-center">V</th>
                <th className="py-2 px-4 text-center">E</th>
                <th className="py-2 px-4 text-center">D</th>
              </tr>
            </thead>
            <tbody>
              {classification.map((team) => (
                <tr key={team.pos} className={`border-b ${team.team === 'Flamengo' ? 'bg-red-50 font-bold' : ''}`}>
                  <td className="py-2 px-4">{team.pos}</td>
                  <td className="py-2 px-4">{team.team}</td>
                  <td className="py-2 px-4 text-center font-bold">{team.pts}</td>
                  <td className="py-2 px-4 text-center">{team.w}</td>
                  <td className="py-2 px-4 text-center">{team.d}</td>
                  <td className="py-2 px-4 text-center">{team.l}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Admin Panel */}
      {showAdmin && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <i className="fas fa-rss"></i> Busca Automática de Notícias
              </h2>
              <button onClick={() => setShowAdmin(false)} className="text-white hover:text-gray-200">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              {!loading && news.length === 0 && (
                <div className="text-center py-12">
                  <i className="fas fa-newspaper text-6xl text-gray-300 mb-4"></i>
                  <h3 className="text-xl font-bold text-gray-600 mb-2">Buscar Notícias Reais</h3>
                  <p className="text-gray-500 mb-6">Clique no botão abaixo para buscar notícias do Flamengo</p>
                  <button 
                    onClick={handleFetchNews}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700"
                  >
                    <i className="fas fa-search mr-2"></i>Buscar Notícias
                  </button>
                </div>
              )}

              {loading && (
                <div className="text-center py-12">
                  <i className="fas fa-spinner fa-spin text-5xl text-green-600 mb-4"></i>
                  <p className="text-gray-600">Buscando notícias...</p>
                </div>
              )}

              {news.length > 0 && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">{selectedNews.size} de {news.length} selecionadas</span>
                    <button 
                      onClick={handleImportSelected}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                    >
                      <i className="fas fa-download mr-1"></i>Importar Selecionadas
                    </button>
                  </div>

                  <div className="space-y-3">
                    {news.map((item, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          const next = new Set(selectedNews);
                          next.has(idx) ? next.delete(idx) : next.add(idx);
                          setSelectedNews(next);
                        }}
                        className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all ${
                          selectedNews.has(idx) ? 'border-green-500 shadow-md' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            selectedNews.has(idx) ? 'bg-green-500 border-green-500' : 'border-gray-300'
                          }`}>
                            {selectedNews.has(idx) && <i className="fas fa-check text-white text-xs"></i>}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                              <span>{item.source}</span>
                              <span>•</span>
                              <span>{new Date(item.pubDate).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black text-gray-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p>© 2026 Diário Rubro-Negro. Todos os direitos reservados.</p>
          <p className="text-xs mt-2">Feito com ❤️ pela Nação Rubro-Negra 🔴⚫</p>
        </div>
      </footer>
    </div>
  );
}
