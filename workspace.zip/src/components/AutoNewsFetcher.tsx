import { useState, useEffect } from 'react';
import { fetchAllNewsComplete, fetchAllNews, fetchFromGoogleNews, defaultSources, NewsSource, FetchedNews } from '../services/newsFetcher';
import { reformulateNews } from '../utils/newsReformulator';
import { NewsDraft } from '../data/draftNews';

interface AutoNewsFetcherProps {
  onImport: (news: NewsDraft[]) => void;
  onClose: () => void;
}

export default function AutoNewsFetcher({ onImport, onClose }: AutoNewsFetcherProps) {
  const [loading, setLoading] = useState(false);
  const [fetchedNews, setFetchedNews] = useState<FetchedNews[]>([]);
  const [selectedNews, setSelectedNews] = useState<Set<number>>(new Set());
  const [reformulated, setReformulated] = useState<Map<number, any>>(new Map());
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [sources, setSources] = useState<NewsSource[]>(() => {
    const saved = localStorage.getItem('drn_sources');
    return saved ? JSON.parse(saved) : defaultSources;
  });
  const [showSources, setShowSources] = useState(false);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      handleFetchAll();
    }, 5 * 60 * 1000); // 5 minutos
    return () => clearInterval(interval);
  }, [autoRefresh, sources]);

  const handleFetchAll = async () => {
    setLoading(true);
    setError('');
    setProgress('Buscando notícias de todas as fontes...');
    
    try {
      const news = await fetchAllNewsComplete();
      setFetchedNews(news);
      setLastFetch(new Date());
      setProgress(`${news.length} notícias encontradas!`);
      
      // Reformular automaticamente
      setProgress('Reformulando notícias...');
      const reformMap = new Map();
      news.forEach((n, idx) => {
        try {
          const result = reformulateNews({
            originalTitle: n.title,
            originalContent: n.content || n.description,
            source: n.source
          });
          reformMap.set(idx, result);
        } catch (e) {
          console.error('Erro ao reformular:', e);
        }
      });
      setReformulated(reformMap);
      
      // Selecionar todas por padrão
      setSelectedNews(new Set(news.map((_, i) => i)));
    } catch (err: any) {
      setError('Erro ao buscar notícias. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchFromSource = async (source: NewsSource) => {
    setLoading(true);
    setProgress(`Buscando de ${source.name}...`);
    
    try {
      const news = await fetchAllNews([source]);
      setFetchedNews(prev => {
        const existing = new Set(prev.map(n => n.title.toLowerCase()));
        const newItems = news.filter(n => !existing.has(n.title.toLowerCase()));
        return [...prev, ...newItems];
      });
      
      // Reformular novas
      const reformMap = new Map(reformulated);
      news.forEach((n, idx) => {
        const actualIdx = fetchedNews.length + idx;
        try {
          const result = reformulateNews({
            originalTitle: n.title,
            originalContent: n.content || n.description,
            source: n.source
          });
          reformMap.set(actualIdx, result);
        } catch (e) {
          console.error('Erro ao reformular:', e);
        }
      });
      setReformulated(reformMap);
      setLastFetch(new Date());
    } catch (err) {
      setError(`Erro ao buscar de ${source.name}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (idx: number) => {
    setSelectedNews(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedNews.size === fetchedNews.length) {
      setSelectedNews(new Set());
    } else {
      setSelectedNews(new Set(fetchedNews.map((_, i) => i)));
    }
  };

  const handleImportSelected = () => {
    const drafts: NewsDraft[] = [];
    
    selectedNews.forEach(idx => {
      const original = fetchedNews[idx];
      const reform = reformulated.get(idx);
      
      if (original && reform) {
        drafts.push({
          id: `auto-${Date.now()}-${idx}`,
          title: reform.title,
          excerpt: reform.excerpt,
          content: reform.content,
          category: reform.category,
          author: 'Redação DRN',
          image: original.thumbnail || 'https://image.qwenlm.ai/generated-images/7f7a7ab0-72d8-460c-99dc-d2efe20a81c1/_result.png',
          tags: reform.tags,
          status: 'pending',
          createdAt: new Date().toISOString()
        });
      }
    });
    
    if (drafts.length > 0) {
      onImport(drafts);
      onClose();
    }
  };

  const toggleSource = (id: string) => {
    setSources(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s);
      localStorage.setItem('drn_sources', JSON.stringify(updated));
      return updated;
    });
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Agora';
      if (diffMins < 60) return `Há ${diffMins} min`;
      if (diffHours < 24) return `Há ${diffHours}h`;
      if (diffDays < 7) return `Há ${diffDays} dias`;
      return d.toLocaleDateString('pt-BR');
    } catch {
      return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4 overflow-y-auto">
      <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col my-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 via-emerald-600 to-teal-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <i className="fas fa-rss text-white text-lg"></i>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Busca Automática de Notícias</h2>
              <p className="text-green-100 text-xs">
                Busque notícias REAIS da internet e reformule automaticamente
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl w-9 h-9 rounded-full hover:bg-white/10 transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Controls */}
        <div className="bg-white border-b px-6 py-3 flex flex-wrap items-center gap-2 flex-shrink-0">
          <button 
            onClick={handleFetchAll}
            disabled={loading}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-search'}`}></i>
            {loading ? 'Buscando...' : 'Buscar Todas as Notícias'}
          </button>
          
          <button 
            onClick={() => setShowSources(!showSources)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <i className="fas fa-cog"></i>
            Fontes ({sources.filter(s => s.enabled).length}/{sources.length})
          </button>

          <label className="flex items-center gap-2 ml-auto cursor-pointer">
            <input 
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 accent-green-600"
            />
            <span className="text-xs text-gray-600">Auto-refresh (5min)</span>
          </label>

          {lastFetch && (
            <span className="text-xs text-gray-400">
              Última: {lastFetch.toLocaleTimeString('pt-BR')}
            </span>
          )}
        </div>

        {/* Sources Panel */}
        {showSources && (
          <div className="bg-white border-b px-6 py-3 flex-shrink-0">
            <h4 className="text-sm font-bold text-gray-700 mb-2">Fontes de Notícias</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {sources.map(source => (
                <label key={source.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-100">
                  <input 
                    type="checkbox"
                    checked={source.enabled}
                    onChange={() => toggleSource(source.id)}
                    className="w-4 h-4 accent-green-600"
                  />
                  <span className="text-lg">{source.icon}</span>
                  <span className="text-xs font-medium text-gray-700">{source.name}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              <i className="fas fa-info-circle mr-1"></i>
              As notícias são buscadas via RSS feeds públicos e Google News
            </p>
          </div>
        )}

        {/* Progress / Error */}
        {(progress || error) && (
          <div className={`px-6 py-2 text-sm flex items-center gap-2 flex-shrink-0 ${error ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
            <i className={`fas ${error ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
            {error || progress}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {fetchedNews.length === 0 ? (
            <div className="text-center py-16">
              <i className="fas fa-newspaper text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-bold text-gray-600 mb-2">Nenhuma notícia buscada ainda</h3>
              <p className="text-gray-500 text-sm mb-6">
                Clique em "Buscar Todas as Notícias" para encontrar notícias reais sobre o Flamengo
              </p>
              <button 
                onClick={handleFetchAll}
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50"
              >
                <i className="fas fa-search mr-2"></i>
                Buscar Notícias Agora
              </button>
              
              <div className="mt-8 max-w-md mx-auto text-left">
                <h4 className="font-bold text-gray-700 mb-3 text-sm">Como funciona:</h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-start gap-2">
                    <span className="bg-green-100 text-green-700 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">1</span>
                    <span>O sistema busca notícias em tempo real de múltiplas fontes (GE, ESPN, Google News, etc.)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-green-100 text-green-700 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">2</span>
                    <span>Filtra automaticamente apenas notícias sobre o Flamengo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-green-100 text-green-700 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">3</span>
                    <span>Reformula cada notícia automaticamente para parecer conteúdo original</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-green-100 text-green-700 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">4</span>
                    <span>Você seleciona as que quer e importa para aprovação</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-green-100 text-green-700 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">5</span>
                    <span>Aprova e publica no site com um clique</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Selection Bar */}
              <div className="bg-white rounded-lg shadow-sm border p-3 mb-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={selectAll}
                    className="text-sm text-gray-600 hover:text-green-600 font-medium"
                  >
                    {selectedNews.size === fetchedNews.length ? '☑️ Desmarcar todas' : '☐ Selecionar todas'}
                  </button>
                  <span className="text-xs text-gray-500">
                    {selectedNews.size} de {fetchedNews.length} selecionadas
                  </span>
                </div>
                {selectedNews.size > 0 && (
                  <button 
                    onClick={handleImportSelected}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-download"></i>
                    Importar {selectedNews.size} notícia(s)
                  </button>
                )}
              </div>

              {/* News List */}
              <div className="space-y-3">
                {fetchedNews.map((news, idx) => {
                  const reform = reformulated.get(idx);
                  const isSelected = selectedNews.has(idx);
                  
                  return (
                    <div 
                      key={idx}
                      className={`bg-white rounded-lg shadow-sm border-2 overflow-hidden transition-all ${
                        isSelected ? 'border-green-500 shadow-md' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex">
                        {/* Selection checkbox */}
                        <div 
                          className="w-12 flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                          onClick={() => toggleSelect(idx)}
                        >
                          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                            isSelected ? 'bg-green-500 border-green-500' : 'border-gray-300'
                          }`}>
                            {isSelected && <i className="fas fa-check text-white text-xs"></i>}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              {/* Source Badge */}
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  {news.source}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  <i className="far fa-clock mr-0.5"></i>
                                  {formatTime(news.pubDate)}
                                </span>
                                {reform && (
                                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    ✓ Reformulada
                                  </span>
                                )}
                              </div>

                              {/* Original Title */}
                              <div className="mb-2">
                                <span className="text-[10px] text-gray-400 font-bold uppercase">Original:</span>
                                <h4 className="text-sm font-bold text-gray-700 leading-snug line-through opacity-60">
                                  {news.title}
                                </h4>
                              </div>

                              {/* Reformulated Title */}
                              {reform && (
                                <div className="mb-2">
                                  <span className="text-[10px] text-green-600 font-bold uppercase">Reformulada:</span>
                                  <h4 className="text-sm font-bold text-green-800 leading-snug">
                                    {reform.title}
                                  </h4>
                                </div>
                              )}

                              {/* Excerpt */}
                              {reform && (
                                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                  {reform.excerpt}
                                </p>
                              )}

                              {/* Tags & Category */}
                              {reform && (
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {reform.category}
                                  </span>
                                  {reform.tags.map((tag: string) => (
                                    <span key={tag} className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Thumbnail */}
                            {news.thumbnail && (
                              <img 
                                src={news.thumbnail} 
                                alt=""
                                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                              />
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                            <a 
                              href={news.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <i className="fas fa-external-link-alt"></i>
                              Ver original
                            </a>
                            {reform && (
                              <>
                                <span className="text-gray-300">|</span>
                                <span className="text-xs text-gray-500">
                                  <i className="fas fa-file-alt mr-1"></i>
                                  {reform.content.split(' ').length} palavras
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {fetchedNews.length > 0 && (
          <div className="bg-white border-t px-6 py-3 flex items-center justify-between flex-shrink-0">
            <span className="text-xs text-gray-500">
              {fetchedNews.length} notícias encontradas • {selectedNews.size} selecionadas
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleImportSelected}
                disabled={selectedNews.size === 0}
                className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <i className="fas fa-download"></i>
                Importar Selecionadas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
