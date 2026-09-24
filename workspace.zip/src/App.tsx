import { useState, useEffect } from 'react';
import AdminPanel from './components/AdminPanel';
import { NewsDraft, draftNews as initialDrafts } from './data/draftNews';

// Dados das notícias
const mainNews = {
  id: 1,
  title: "Flamengo domina o jogo e vence clássico por 3 a 1 no Maracanã lotado",
  excerpt: "Rubro-Negro carioca fez uma partida impecável e conquistou mais uma vitória importante no Campeonato Brasileiro. Gol de placa de Arrascaeta abriu o placar.",
  image: "https://image.qwenlm.ai/generated-images/7f7a7ab0-72d8-460c-99dc-d2efe20a81c1/_result.png",
  category: "Jogos",
  date: "Há 2 horas",
  author: "Carlos Mendes"
};

const sideNews = [
  {
    id: 2,
    title: "Arrascaeta é eleito o melhor em campo após atuação decisiva",
    image: "https://image.qwenlm.ai/generated-images/95196b26-d213-41f1-b955-b4c1d709a7b1/_result.png",
    category: "Destaque",
    date: "Há 3 horas"
  },
  {
    id: 3,
    title: "Comissão técnica define treino fechado visando próxima rodada",
    image: "https://image.qwenlm.ai/generated-images/4664e78f-8559-405b-9398-0e9a1fcc293a/_result.png",
    category: "Treino",
    date: "Há 5 horas"
  },
  {
    id: 4,
    title: "Diretoria avança em negociação para reforço de peso",
    image: "https://image.qwenlm.ai/generated-images/8e2d6188-f5b4-4912-a4fc-ab24bf15c39f/_result.png",
    category: "Mercado",
    date: "Há 6 horas"
  }
];

const newsList = [
  {
    id: 5,
    title: "Filho do Flamengo: jovem promessa renova contrato até 2028",
    excerpt: "Cria da base flamenguista impressionou nos treinos e ganhou confiança da comissão técnica para permanecer no elenco principal.",
    category: "Base",
    date: "Há 7 horas",
    comments: 45
  },
  {
    id: 6,
    title: "Maracanã: novo gramado recebe elogios dos jogadores após reforma",
    excerpt: "Atletas rubro-negros aprovaram as condições do gramado do templo do futebol brasileiro para a sequência da temporada.",
    category: "Maracanã",
    date: "Há 8 horas",
    comments: 32
  },
  {
    id: 7,
    title: "Análise tática: como o Flamengo se reinventou sob novo esquema",
    excerpt: "Mudança no sistema de jogo trouxe mais equilíbrio e eficiência ao time. Entenda as principais mudanças táticas.",
    category: "Análise",
    date: "Há 10 horas",
    comments: 78
  },
  {
    id: 8,
    title: "Torcida organizada prepara festa especial para próximo jogo em casa",
    excerpt: "Grupos de torcedores já estão se organizando para criar uma atmosfera única no Maracanã na próxima partida.",
    category: "Torcida",
    date: "Há 12 horas",
    comments: 56
  },
  {
    id: 9,
    title: "Lesão: departamento médico atualiza situação de titulares",
    excerpt: "Dois jogadores que sentiram desconforto muscular passaram por exames e têm previsão de retorno definida.",
    category: "Departamento Médico",
    date: "Há 14 horas",
    comments: 23
  },
  {
    id: 10,
    title: "Libertadores: Flamengo conhece possíveis adversários nas oitavas",
    excerpt: "Sorteio da CONMEBOL definiu os confrontos da próxima fase. Rubro-Negro pode pegar time argentino ou uruguaio.",
    category: "Libertadores",
    date: "Há 16 horas",
    comments: 112
  },
  {
    id: 11,
    title: "Entrevista: 'Estamos focados no título', afirma capitão",
    excerpt: "Líder do vestiário falou sobre a sequência da temporada e a busca pelo campeonato brasileiro.",
    category: "Entrevista",
    date: "Há 18 horas",
    comments: 67
  },
  {
    id: 12,
    title: "Números: Flamengo tem melhor ataque do campeonato após 15 rodadas",
    excerpt: "Estatísticas mostram a eficiência ofensiva rubro-negra. Time é o que mais finaliza e mais acerta o gol.",
    category: "Estatísticas",
    date: "Há 20 horas",
    comments: 34
  }
];

const classification = [
  { pos: 1, team: "Flamengo", pts: 38, w: 12, d: 2, l: 1, gf: 35, ga: 10 },
  { pos: 2, team: "Palmeiras", pts: 35, w: 11, d: 2, l: 2, gf: 30, ga: 12 },
  { pos: 3, team: "Botafogo", pts: 33, w: 10, d: 3, l: 2, gf: 28, ga: 14 },
  { pos: 4, team: "Fortaleza", pts: 31, w: 9, d: 4, l: 2, gf: 25, ga: 13 },
  { pos: 5, team: "São Paulo", pts: 29, w: 8, d: 5, l: 2, gf: 22, ga: 15 },
  { pos: 6, team: "Internacional", pts: 28, w: 8, d: 4, l: 3, gf: 24, ga: 16 },
  { pos: 7, team: "Atlético-MG", pts: 27, w: 8, d: 3, l: 4, gf: 26, ga: 18 },
  { pos: 8, team: "Fluminense", pts: 25, w: 7, d: 4, l: 4, gf: 20, ga: 17 },
  { pos: 9, team: "Corinthians", pts: 24, w: 7, d: 3, l: 5, gf: 21, ga: 19 },
  { pos: 10, team: "Grêmio", pts: 23, w: 6, d: 5, l: 4, gf: 19, ga: 18 },
];

const nextMatches = [
  { opponent: "Palmeiras", competition: "Brasileirão", date: "Dom, 15/06", time: "16:00", location: "Maracanã" },
  { opponent: "River Plate", competition: "Libertadores", date: "Ter, 18/06", time: "21:30", location: "Maracanã" },
  { opponent: "Vasco", competition: "Brasileirão", date: "Sáb, 22/06", time: "18:30", location: "Maracanã" },
];

// Dados do Fórum
const forumCategories = [
  { id: 'geral', name: 'Geral', icon: 'fa-comments', color: 'bg-red-600', count: 1245, description: 'Assuntos gerais sobre o Flamengo' },
  { id: 'jogos', name: 'Próximos Jogos', icon: 'fa-futbol', color: 'bg-green-600', count: 876, description: 'Discussões sobre partidas e escalações' },
  { id: 'mercado', name: 'Mercado da Bola', icon: 'fa-exchange-alt', color: 'bg-blue-600', count: 2103, description: 'Rumores, negociações e contratações' },
  { id: 'analise', name: 'Análise Tática', icon: 'fa-chalkboard', color: 'bg-purple-600', count: 534, description: 'Discussões táticas e análises de jogo' },
  { id: 'nostalgia', name: 'Nostalgia', icon: 'fa-history', color: 'bg-yellow-600', count: 678, description: 'Momentos históricos e memórias rubro-negras' },
  { id: 'off', name: 'Off-Topic', icon: 'fa-coffee', color: 'bg-gray-600', count: 445, description: 'Conversas fora do tema futebol' },
];

const forumTopics = [
  {
    id: 1,
    title: "Arrascaeta merece renovação? O que vocês acham do salário pedido?",
    author: "FlaMinas2024",
    avatar: "FM",
    category: "geral",
    replies: 156,
    views: 2340,
    lastReply: "Há 5 min",
    lastReplyBy: "NacaoRubroNegra",
    pinned: true,
    hot: true,
    tags: ["Arrascaeta", "Contrato"]
  },
  {
    id: 2,
    title: "Palpite para o próximo jogo contra o Palmeiras - Escalação ideal",
    author: "TaticoFla",
    avatar: "TF",
    category: "jogos",
    replies: 89,
    views: 1567,
    lastReply: "Há 12 min",
    lastReplyBy: "UrubuRei",
    pinned: false,
    hot: true,
    tags: ["Escalação", "Palmeiras"]
  },
  {
    id: 3,
    title: "URGENTE: Jornal argentino aponta nome novo para o ataque do Flamengo",
    author: "MercadoFLA",
    avatar: "MF",
    category: "mercado",
    replies: 234,
    views: 5678,
    lastReply: "Há 18 min",
    lastReplyBy: "CRF1895",
    pinned: false,
    hot: true,
    tags: ["Reforço", "Atacante"]
  },
  {
    id: 4,
    title: "Análise: Por que o 4-3-3 funciona melhor que o 4-2-3-1 para esse elenco",
    author: "ProfessorRubroNegro",
    avatar: "PR",
    category: "analise",
    replies: 67,
    views: 987,
    lastReply: "Há 25 min",
    lastReplyBy: "FlaTatico",
    pinned: false,
    hot: false,
    tags: ["Tática", "Esquema"]
  },
  {
    id: 5,
    title: "Vocês lembram do gol de Adriano contra o Vasco em 2001? QUE MOMENTO!",
    author: "SaudosistaFLA",
    avatar: "SF",
    category: "nostalgia",
    replies: 45,
    views: 756,
    lastReply: "Há 32 min",
    lastReplyBy: "Imperador9",
    pinned: false,
    hot: false,
    tags: ["Adriano", "2001"]
  },
  {
    id: 6,
    title: "Alguém mais acha que a base deveria ter mais oportunidades?",
    author: "BaseSempre",
    avatar: "BS",
    category: "geral",
    replies: 78,
    views: 1234,
    lastReply: "Há 45 min",
    lastReplyBy: "JovemCraque",
    pinned: false,
    hot: false,
    tags: ["Base", "Jovens"]
  },
  {
    id: 7,
    title: "Qual a melhor camisa do Flamengo de todos os tempos? Votação!",
    author: "DesignFLA",
    avatar: "DF",
    category: "geral",
    replies: 112,
    views: 3456,
    lastReply: "Há 1 hora",
    lastReplyBy: "MantoSagrado",
    pinned: false,
    hot: true,
    tags: ["Camisa", "Votação"]
  },
  {
    id: 8,
    title: "Libertadores 2026: Vamos pra cima! Análise dos possíveis adversários",
    author: "LibertadoresFLA",
    avatar: "LF",
    category: "jogos",
    replies: 56,
    views: 890,
    lastReply: "Há 1 hora",
    lastReplyBy: "TriRubroNegro",
    pinned: false,
    hot: false,
    tags: ["Libertadores", "Análise"]
  },
];

const topMembers = [
  { name: "NacaoRubroNegra", posts: 3456, avatar: "NR", level: "Lenda" },
  { name: "FlaMinas2024", posts: 2890, avatar: "FM", level: "Veterano" },
  { name: "TaticoFla", posts: 2345, avatar: "TF", level: "Veterano" },
  { name: "MercadoFLA", posts: 1987, avatar: "MF", level: "Experiente" },
  { name: "CRF1895", posts: 1654, avatar: "CR", level: "Experiente" },
];

function App() {
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState<'home' | 'forum'>('home');
  const [forumFilter, setForumFilter] = useState('todos');
  const [showNewTopic, setShowNewTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('geral');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const [publishedNews, setPublishedNews] = useState<NewsDraft[]>([]);
  const [pendingCount, setPendingCount] = useState(0);

  const categories = ['Todas', 'Jogos', 'Mercado', 'Treino', 'Libertadores', 'Base', 'Análise'];

  const filteredNews = activeCategory === 'Todas' 
    ? newsList 
    : newsList.filter(n => n.category === activeCategory);

  const filteredTopics = forumFilter === 'todos' 
    ? forumTopics 
    : forumTopics.filter(t => t.category === forumFilter);

  const handleCreateTopic = () => {
    if (newTopicTitle.trim() && newTopicContent.trim()) {
      setShowNewTopic(false);
      setNewTopicTitle('');
      setNewTopicCategory('geral');
      setNewTopicContent('');
      alert('Tópico criado com sucesso! 🎉');
    }
  };

  // Contar notícias pendentes ao carregar
  useEffect(() => {
    const saved = localStorage.getItem('drn_news');
    if (saved) {
      const allNews = JSON.parse(saved);
      setPendingCount(allNews.filter((n: NewsDraft) => n.status === 'pending').length);
    } else {
      setPendingCount(initialDrafts.filter(n => n.status === 'pending').length);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Bar */}
      <div className="bg-black text-white text-sm py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">🔴⚫ O maior portal da Nação Rubro-Negra</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-gray-400">Siga-nos:</span>
            <a href="#" className="hover:text-red-400 transition-colors"><i className="fab fa-instagram"></i></a>
            <a href="#" className="hover:text-red-400 transition-colors"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-red-400 transition-colors"><i className="fab fa-youtube"></i></a>
            <a href="#" className="hover:text-red-400 transition-colors"><i className="fab fa-tiktok"></i></a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActivePage('home')}>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-2xl font-black text-red-700">DR</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  DIÁRIO RUBRO-NEGRO
                </h1>
                <p className="text-red-100 text-xs md:text-sm">Tudo sobre o Flamengo em um só lugar</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar notícias..." 
                  className="bg-white/20 border border-white/30 rounded-full px-4 py-2 text-white placeholder-red-100 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 w-48"
                />
                <i className="fas fa-search absolute right-3 top-2.5 text-red-100 text-sm"></i>
              </div>
              <button 
                onClick={() => setShowAdmin(true)}
                className="relative bg-white/20 hover:bg-white/30 border border-white/30 rounded-full w-10 h-10 flex items-center justify-center text-white transition-colors"
                title="Painel Administrativo"
              >
                <i className="fas fa-cog"></i>
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowAdmin(true)}
                className="relative bg-white/20 hover:bg-white/30 border border-white/30 rounded-full w-10 h-10 flex items-center justify-center text-white transition-colors"
                title="Painel Administrativo"
              >
                <i className="fas fa-cog"></i>
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </button>
              <button 
                className="md:hidden text-white text-2xl"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`${menuOpen ? 'block' : 'hidden'} md:block bg-red-800/80 backdrop-blur-sm border-t border-red-600/50`}>
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex flex-col md:flex-row md:items-center gap-0 md:gap-1 py-2">
              {[
                { name: 'Início', page: 'home' as const },
                { name: 'Notícias', page: 'home' as const },
                { name: 'Jogos', page: 'home' as const },
                { name: 'Libertadores', page: 'home' as const },
                { name: 'Brasileirão', page: 'home' as const },
                { name: 'Transferências', page: 'home' as const },
                { name: 'Fórum', page: 'forum' as const },
                { name: 'Vídeos', page: 'home' as const },
              ].map((item) => (
                <li key={item.name}>
                  <button 
                    onClick={() => { setActivePage(item.page); setMenuOpen(false); }}
                    className={`block px-4 py-2 rounded-md transition-colors text-sm font-medium w-full text-left ${
                      (item.page === 'forum' && activePage === 'forum') || (item.page === 'home' && activePage === 'home' && item.name === 'Início')
                        ? 'bg-red-600 text-white' 
                        : 'text-white hover:bg-red-600'
                    }`}
                  >
                    {item.name === 'Fórum' && <i className="fas fa-comments mr-1"></i>}
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Breaking News Ticker */}
      <div className="bg-black text-white py-2 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
          <span className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold uppercase whitespace-nowrap animate-pulse">
            Urgente
          </span>
          <div className="overflow-hidden whitespace-nowrap">
            <span className="inline-block animate-marquee text-sm">
              🔴 Flamengo anuncia renovação de contrato de jovem promessa da base até 2028 | ⚫ Maracanã terá lotação máxima no próximo domingo | 🔴 Arrascaeta é dúvida para próxima partida devido a cansaço muscular | ⚫ Diretoria confirma mais uma contratação para a sequência da temporada
            </span>
          </div>
        </div>
      </div>

      {/* ============ HOME PAGE ============ */}
      {activePage === 'home' && (
        <>
          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 py-6">
            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Main News */}
              <div className="lg:col-span-2">
                <div className="relative group cursor-pointer overflow-hidden rounded-xl shadow-xl">
                  <img 
                    src={mainNews.image} 
                    alt={mainNews.title}
                    className="w-full h-64 md:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                      {mainNews.category}
                    </span>
                    <h2 className="text-xl md:text-3xl font-bold text-white mb-2 leading-tight">
                      {mainNews.title}
                    </h2>
                    <p className="text-gray-200 text-sm md:text-base mb-3 hidden md:block">
                      {mainNews.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-gray-300 text-xs">
                      <span><i className="far fa-clock mr-1"></i>{mainNews.date}</span>
                      <span><i className="far fa-user mr-1"></i>{mainNews.author}</span>
                      <span><i className="far fa-comment mr-1"></i>89 comentários</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side News */}
              <div className="flex flex-col gap-4">
                {sideNews.map((news) => (
                  <div key={news.id} className="flex gap-3 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="w-28 h-28 md:w-32 md:h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="py-2 pr-3 flex flex-col justify-center">
                      <span className="text-red-600 text-xs font-bold uppercase">{news.category}</span>
                      <h3 className="text-sm font-semibold text-gray-800 leading-tight mt-1 line-clamp-3 group-hover:text-red-700 transition-colors">
                        {news.title}
                      </h3>
                      <span className="text-gray-400 text-xs mt-1">
                        <i className="far fa-clock mr-1"></i>{news.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Published News from Admin Panel */}
            {publishedNews.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-1 h-6 bg-green-600 rounded-full"></span>
                    <i className="fas fa-check-circle text-green-600"></i>
                    Publicadas pelo Editor
                  </h2>
                  <span className="text-xs text-gray-500 bg-green-50 text-green-700 px-3 py-1 rounded-full">
                    {publishedNews.length} nova(s) matéria(s)
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {publishedNews.slice(0, 4).map((pubNews) => (
                    <article key={pubNews.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer group border-l-4 border-green-600">
                      <img src={pubNews.image} alt={pubNews.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">
                            {pubNews.category}
                          </span>
                          <span className="text-gray-400 text-xs">
                            <i className="far fa-clock mr-1"></i>
                            {new Date(pubNews.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-800 group-hover:text-red-700 transition-colors leading-snug mb-2">
                          {pubNews.title}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-2">{pubNews.excerpt}</p>
                        <div className="flex items-center gap-2 mt-3">
                          {pubNews.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* News List */}
              <div className="lg:col-span-2">
                {/* Category Filter */}
                <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        activeCategory === cat 
                          ? 'bg-red-600 text-white shadow-md' 
                          : 'bg-white text-gray-600 hover:bg-red-50 border border-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Section Title */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                    Últimas Notícias
                  </h2>
                  <a href="#" className="text-red-600 text-sm font-medium hover:underline">
                    Ver todas →
                  </a>
                </div>

                {/* News Cards */}
                <div className="space-y-4">
                  {filteredNews.map((news) => (
                    <article key={news.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer group border-l-4 border-red-600">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded">
                              {news.category}
                            </span>
                            <span className="text-gray-400 text-xs">
                              <i className="far fa-clock mr-1"></i>{news.date}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-gray-800 group-hover:text-red-700 transition-colors leading-snug">
                            {news.title}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                            {news.excerpt}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-gray-400 text-xs">
                            <span><i className="far fa-comment mr-1"></i>{news.comments} comentários</span>
                            <span><i className="far fa-share-square mr-1"></i>Compartilhar</span>
                          </div>
                        </div>
                        <i className="fas fa-chevron-right text-gray-300 group-hover:text-red-600 transition-colors mt-4"></i>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-6">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-md hover:shadow-lg">
                    Carregar mais notícias
                  </button>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                {/* Classification */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-red-700 to-red-600 px-4 py-3">
                    <h3 className="text-white font-bold text-sm flex items-center gap-2">
                      <i className="fas fa-trophy"></i>
                      Classificação - Brasileirão
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600">
                          <th className="py-2 px-2 text-left">#</th>
                          <th className="py-2 px-2 text-left">Time</th>
                          <th className="py-2 px-1 text-center">P</th>
                          <th className="py-2 px-1 text-center">J</th>
                          <th className="py-2 px-1 text-center">V</th>
                          <th className="py-2 px-1 text-center">E</th>
                          <th className="py-2 px-1 text-center">D</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classification.map((team) => (
                          <tr 
                            key={team.pos} 
                            className={`border-b border-gray-50 ${team.team === 'Flamengo' ? 'bg-red-50 font-bold' : ''}`}
                          >
                            <td className="py-2 px-2">
                              <span className={`inline-block w-5 h-5 rounded-full text-center leading-5 text-white text-xs ${
                                team.pos <= 4 ? 'bg-green-500' : team.pos <= 6 ? 'bg-blue-500' : 'bg-gray-400'
                              }`}>
                                {team.pos}
                              </span>
                            </td>
                            <td className="py-2 px-2 font-medium text-gray-700">{team.team}</td>
                            <td className="py-2 px-1 text-center font-bold">{team.pts}</td>
                            <td className="py-2 px-1 text-center text-gray-500">{team.w + team.d + team.l}</td>
                            <td className="py-2 px-1 text-center text-gray-500">{team.w}</td>
                            <td className="py-2 px-1 text-center text-gray-500">{team.d}</td>
                            <td className="py-2 px-1 text-center text-gray-500">{team.l}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-4 py-2 bg-gray-50 text-center">
                    <a href="#" className="text-red-600 text-xs font-medium hover:underline">Ver tabela completa →</a>
                  </div>
                </div>

                {/* Next Matches */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-black to-gray-800 px-4 py-3">
                    <h3 className="text-white font-bold text-sm flex items-center gap-2">
                      <i className="fas fa-calendar-alt"></i>
                      Próximos Jogos
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {nextMatches.map((match, idx) => (
                      <div key={idx} className="p-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-red-600 uppercase">{match.competition}</span>
                          <span className="text-xs text-gray-400">{match.date}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-red-700">FLA</span>
                            </div>
                            <span className="font-bold text-gray-700 text-sm">Flamengo</span>
                          </div>
                          <span className="text-gray-400 text-xs font-bold">VS</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-700 text-sm">{match.opponent}</span>
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-500">
                                {match.opponent.substring(0, 3).toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
                          <span><i className="fas fa-map-marker-alt mr-1"></i>{match.location}</span>
                          <span><i className="far fa-clock mr-1"></i>{match.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Forum Quick Access */}
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-md p-5 text-center cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActivePage('forum')}>
                  <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-comments text-white text-2xl"></i>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">Fórum da Nação</h3>
                  <p className="text-gray-400 text-sm mb-3">Discuta com outros torcedores!</p>
                  <div className="flex justify-center gap-4 text-xs text-gray-400 mb-3">
                    <span><i className="fas fa-users mr-1"></i>12.5K membros</span>
                    <span><i className="fas fa-comment mr-1"></i>5.8K tópicos</span>
                  </div>
                  <button className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition-colors">
                    Acessar Fórum →
                  </button>
                </div>

                {/* Newsletter */}
                <div className="bg-gradient-to-br from-red-700 to-red-900 rounded-xl shadow-md p-5 text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-envelope text-white text-xl"></i>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">Newsletter</h3>
                  <p className="text-red-100 text-sm mb-4">Receba as notícias do Flamengo direto no seu e-mail!</p>
                  <input 
                    type="email" 
                    placeholder="Seu melhor e-mail" 
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2.5 text-white placeholder-red-200 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button className="w-full bg-white text-red-700 font-bold py-2.5 rounded-lg hover:bg-red-50 transition-colors text-sm">
                    Inscrever-se Grátis
                  </button>
                </div>

                {/* Social Stats */}
                <div className="bg-white rounded-xl shadow-md p-4">
                  <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
                    <i className="fas fa-users text-red-600"></i>
                    Nossas Redes
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <a href="#" className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-2.5 hover:opacity-90 transition-opacity">
                      <i className="fab fa-instagram"></i>
                      <div>
                        <div className="text-xs font-bold">Instagram</div>
                        <div className="text-[10px] opacity-80">2.5M seguidores</div>
                      </div>
                    </a>
                    <a href="#" className="flex items-center gap-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg p-2.5 hover:opacity-90 transition-opacity">
                      <i className="fab fa-twitter"></i>
                      <div>
                        <div className="text-xs font-bold">Twitter/X</div>
                        <div className="text-[10px] opacity-80">1.8M seguidores</div>
                      </div>
                    </a>
                    <a href="#" className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg p-2.5 hover:opacity-90 transition-opacity">
                      <i className="fab fa-youtube"></i>
                      <div>
                        <div className="text-xs font-bold">YouTube</div>
                        <div className="text-[10px] opacity-80">890K inscritos</div>
                      </div>
                    </a>
                    <a href="#" className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-lg p-2.5 hover:opacity-90 transition-opacity">
                      <i className="fab fa-tiktok"></i>
                      <div>
                        <div className="text-xs font-bold">TikTok</div>
                        <div className="text-[10px] opacity-80">1.2M seguidores</div>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Poll */}
                <div className="bg-white rounded-xl shadow-md p-4">
                  <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
                    <i className="fas fa-poll text-red-600"></i>
                    Enquete do Dia
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 font-medium">Quem deve ser o próximo reforço do Flamengo?</p>
                  <div className="space-y-2">
                    {[
                      { option: 'Atacante estrangeiro', votes: 45 },
                      { option: 'Meio-campista brasileiro', votes: 30 },
                      { option: 'Zagueiro experiente', votes: 15 },
                      { option: 'Outro', votes: 10 },
                    ].map((item) => (
                      <label key={item.option} className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name="poll" className="accent-red-600" />
                        <span className="text-sm text-gray-600 group-hover:text-red-600 transition-colors">{item.option}</span>
                        <span className="ml-auto text-xs text-gray-400">{item.votes}%</span>
                      </label>
                    ))}
                  </div>
                  <button className="mt-3 w-full bg-red-600 text-white text-sm py-2 rounded-lg hover:bg-red-700 transition-colors font-medium">
                    Votar
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-2">Total: 3.456 votos</p>
                </div>
              </aside>
            </div>
          </main>

          {/* Video Section */}
          <section className="bg-gradient-to-b from-gray-900 to-black py-10 mt-8">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                <i className="fas fa-play-circle text-red-500"></i>
                Vídeos em Destaque
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'Melhores momentos: Flamengo 3x1', duration: '8:42', views: '125K' },
                  { title: 'Gol de placa de Arrascaeta', duration: '2:15', views: '89K' },
                  { title: 'Bastidores do treino', duration: '5:30', views: '45K' },
                  { title: 'Análise tática completa', duration: '12:08', views: '67K' },
                ].map((video, idx) => (
                  <div key={idx} className="bg-gray-800 rounded-lg overflow-hidden group cursor-pointer hover:ring-2 hover:ring-red-500 transition-all">
                    <div className="relative">
                      <div className="w-full h-36 bg-gradient-to-br from-red-900 to-black flex items-center justify-center">
                        <i className="fas fa-play-circle text-white/50 text-4xl group-hover:text-red-500 transition-colors group-hover:scale-110 transform duration-300"></i>
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                        {video.duration}
                      </span>
                    </div>
                    <div className="p-3">
                      <h4 className="text-white text-sm font-medium line-clamp-2">{video.title}</h4>
                      <span className="text-gray-400 text-xs mt-1">
                        <i className="fas fa-eye mr-1"></i>{video.views} visualizações
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ============ FORUM PAGE ============ */}
      {activePage === 'forum' && (
        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Forum Header */}
          <div className="bg-gradient-to-r from-red-700 via-red-600 to-black rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                  <i className="fas fa-comments"></i>
                  Fórum da Nação
                </h2>
                <p className="text-red-100 mt-1">O espaço da torcida rubro-negra para debater tudo sobre o Flamengo</p>
              </div>
              <button 
                onClick={() => setShowNewTopic(true)}
                className="bg-white text-red-700 px-5 py-2.5 rounded-full font-bold text-sm hover:bg-red-50 transition-colors shadow-md flex items-center gap-2"
              >
                <i className="fas fa-plus"></i>
                Novo Tópico
              </button>
            </div>
            {/* Forum Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-black text-white">12.5K</div>
                <div className="text-red-200 text-xs">Membros</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-black text-white">5.8K</div>
                <div className="text-red-200 text-xs">Tópicos</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-black text-white">89.2K</div>
                <div className="text-red-200 text-xs">Respostas</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-black text-white">347</div>
                <div className="text-red-200 text-xs">Online agora</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Forum Main Content */}
            <div className="lg:col-span-2">
              {/* Forum Categories */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3">
                  <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    <i className="fas fa-th-large"></i>
                    Categorias
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                  {forumCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setForumFilter(cat.id === forumFilter ? 'todos' : cat.id)}
                      className={`flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors ${
                        forumFilter === cat.id ? 'bg-red-50 border-l-4 border-red-600' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 ${cat.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <i className={`fas ${cat.icon} text-white`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-800 text-sm">{cat.name}</div>
                        <div className="text-gray-400 text-xs truncate">{cat.description}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs font-bold text-red-600">{cat.count}</div>
                        <div className="text-[10px] text-gray-400">tópicos</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Topics List */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3 flex items-center justify-between">
                  <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    <i className="fas fa-list"></i>
                    Tópicos Recentes
                    {forumFilter !== 'todos' && (
                      <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full ml-2">
                        {forumCategories.find(c => c.id === forumFilter)?.name}
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-2">
                    <select className="bg-gray-700 text-white text-xs rounded px-2 py-1 border-none focus:outline-none">
                      <option>Mais recentes</option>
                      <option>Mais respondidos</option>
                      <option>Mais visualizados</option>
                    </select>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {filteredTopics.map((topic) => (
                    <div key={topic.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">{topic.avatar}</span>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            {topic.pinned && (
                              <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                <i className="fas fa-thumbtack mr-0.5"></i>Fixo
                              </span>
                            )}
                            {topic.hot && (
                              <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                <i className="fas fa-fire mr-0.5"></i>Hot
                              </span>
                            )}
                            <span className="bg-gray-100 text-gray-500 text-[10px] font-medium px-1.5 py-0.5 rounded">
                              {forumCategories.find(c => c.id === topic.category)?.name}
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-800 text-sm group-hover:text-red-700 transition-colors leading-snug">
                            {topic.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            <span className="text-xs text-gray-500">
                              por <span className="font-medium text-red-600">{topic.author}</span>
                            </span>
                            <span className="text-xs text-gray-400">
                              <i className="far fa-clock mr-0.5"></i>{topic.lastReply}
                            </span>
                          </div>
                          {/* Tags */}
                          <div className="flex items-center gap-1.5 mt-2">
                            {topic.tags.map((tag) => (
                              <span key={tag} className="bg-red-50 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-medium">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-col items-end gap-1 flex-shrink-0 text-right">
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span title="Respostas">
                              <i className="far fa-comment-dots mr-0.5"></i>
                              <span className="font-bold text-gray-700">{topic.replies}</span>
                            </span>
                            <span title="Visualizações">
                              <i className="far fa-eye mr-0.5"></i>
                              <span className="font-bold text-gray-700">{topic.views >= 1000 ? `${(topic.views/1000).toFixed(1)}K` : topic.views}</span>
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-400">
                            Último: <span className="font-medium">{topic.lastReplyBy}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Mostrando {filteredTopics.length} de {forumTopics.length} tópicos</span>
                  <div className="flex items-center gap-1">
                    <button className="w-7 h-7 rounded bg-red-600 text-white text-xs font-bold">1</button>
                    <button className="w-7 h-7 rounded bg-white border border-gray-200 text-gray-600 text-xs hover:bg-gray-50">2</button>
                    <button className="w-7 h-7 rounded bg-white border border-gray-200 text-gray-600 text-xs hover:bg-gray-50">3</button>
                    <span className="text-gray-400 text-xs px-1">...</span>
                    <button className="w-7 h-7 rounded bg-white border border-gray-200 text-gray-600 text-xs hover:bg-gray-50">12</button>
                    <button className="w-7 h-7 rounded bg-white border border-gray-200 text-gray-600 text-xs hover:bg-gray-50">
                      <i className="fas fa-chevron-right text-[10px]"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Forum Sidebar */}
            <aside className="space-y-6">
              {/* Top Members */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-4 py-3">
                  <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    <i className="fas fa-crown"></i>
                    Top Membros
                  </h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {topMembers.map((member, idx) => (
                    <div key={member.name} className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors">
                      <span className="text-xs font-bold text-gray-400 w-4">{idx + 1}º</span>
                      <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{member.avatar}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-800 text-xs truncate">{member.name}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400">{member.posts} posts</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            member.level === 'Lenda' ? 'bg-yellow-100 text-yellow-700' :
                            member.level === 'Veterano' ? 'bg-purple-100 text-purple-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>{member.level}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Forum Rules */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-3">
                  <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    <i className="fas fa-gavel"></i>
                    Regras do Fórum
                  </h3>
                </div>
                <div className="p-4 space-y-2.5">
                  {[
                    "Respeite todos os membros",
                    "Sem spam ou propaganda",
                    "Mantenha o tema do tópico",
                    "Não use linguagem ofensiva",
                    "Conteúdo apenas sobre o Flamengo",
                  ].map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                      <i className="fas fa-check-circle text-green-500 mt-0.5 flex-shrink-0"></i>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Online Users */}
              <div className="bg-white rounded-xl shadow-md p-4">
                <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Online Agora (347)
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {['NacaoRubroNegra', 'FlaMinas2024', 'TaticoFla', 'UrubuRei', 'CRF1895', 'MantoSagrado', 'Imperador9', 'BaseSempre', '+339'].map((user) => (
                    <span key={user} className={`text-[10px] px-2 py-1 rounded-full ${
                      user.startsWith('+') 
                        ? 'bg-gray-100 text-gray-500 font-medium' 
                        : 'bg-red-50 text-red-600 font-medium hover:bg-red-100 cursor-pointer transition-colors'
                    }`}>
                      {user}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-md p-4">
                <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
                  <i className="fas fa-bolt text-red-600"></i>
                  Ações Rápidas
                </h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setShowNewTopic(true)}
                    className="w-full flex items-center gap-2 bg-red-600 text-white rounded-lg p-2.5 hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    <i className="fas fa-plus-circle"></i>
                    Criar Novo Tópico
                  </button>
                  <button className="w-full flex items-center gap-2 bg-gray-100 text-gray-700 rounded-lg p-2.5 hover:bg-gray-200 transition-colors text-sm font-medium">
                    <i className="fas fa-bookmark"></i>
                    Meus Tópicos Salvos
                  </button>
                  <button className="w-full flex items-center gap-2 bg-gray-100 text-gray-700 rounded-lg p-2.5 hover:bg-gray-200 transition-colors text-sm font-medium">
                    <i className="fas fa-bell"></i>
                    Minhas Notificações
                  </button>
                  <button className="w-full flex items-center gap-2 bg-gray-100 text-gray-700 rounded-lg p-2.5 hover:bg-gray-200 transition-colors text-sm font-medium">
                    <i className="fas fa-user-circle"></i>
                    Meu Perfil
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
                  <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    <i className="fas fa-history"></i>
                    Atividade Recente
                  </h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {[
                    { user: 'NacaoRubroNegra', action: 'respondeu em', topic: 'Arrascaeta merece renovação?', time: '5 min' },
                    { user: 'UrubuRei', action: 'criou', topic: 'Palpite para próximo jogo', time: '12 min' },
                    { user: 'CRF1895', action: 'curtiu', topic: 'URGENTE: Nome novo para o ataque', time: '18 min' },
                    { user: 'FlaTatico', action: 'respondeu em', topic: 'Análise do 4-3-3', time: '25 min' },
                  ].map((activity, idx) => (
                    <div key={idx} className="p-3 text-xs">
                      <span className="font-bold text-red-600">{activity.user}</span>
                      <span className="text-gray-500"> {activity.action} </span>
                      <span className="font-medium text-gray-700">{activity.topic}</span>
                      <div className="text-gray-400 mt-0.5">
                        <i className="far fa-clock mr-0.5"></i>Há {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </main>
      )}

      {/* ============ NEW TOPIC MODAL ============ */}
      {showNewTopic && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNewTopic(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-red-700 to-red-600 px-6 py-4 rounded-t-xl flex items-center justify-between">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <i className="fas fa-edit"></i>
                Criar Novo Tópico
              </h3>
              <button onClick={() => setShowNewTopic(false)} className="text-white/80 hover:text-white text-xl">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Título do Tópico</label>
                <input 
                  type="text" 
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="Escreva um título claro e objetivo..." 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Categoria</label>
                <select 
                  value={newTopicCategory}
                  onChange={(e) => setNewTopicCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {forumCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Conteúdo</label>
                <textarea 
                  value={newTopicContent}
                  onChange={(e) => setNewTopicContent(e.target.value)}
                  placeholder="Escreva o conteúdo do seu tópico aqui..." 
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                ></textarea>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <i className="fas fa-info-circle text-blue-500"></i>
                  Certifique-se de seguir as regras do fórum. Tópicos que desrespeitarem as regras serão removidos.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button 
                  onClick={handleCreateTopic}
                  className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-red-700 transition-colors"
                >
                  <i className="fas fa-paper-plane mr-1"></i> Publicar Tópico
                </button>
                <button 
                  onClick={() => setShowNewTopic(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {showAdmin && (
        <AdminPanel 
          onClose={() => setShowAdmin(false)}
          onPublish={(news) => {
            setPublishedNews(news);
            // Atualizar contador de pendentes
            const saved = localStorage.getItem('drn_news');
            if (saved) {
              const allNews = JSON.parse(saved);
              setPendingCount(allNews.filter((n: NewsDraft) => n.status === 'pending').length);
            }
          }}
        />
      )}

      {/* News Importer - será renderizado dentro do AdminPanel */}

      {/* Footer */}
      <footer className="bg-black text-gray-400">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-black text-sm">DR</span>
                </div>
                <span className="text-white font-bold">DIÁRIO RUBRO-NEGRO</span>
              </div>
              <p className="text-sm leading-relaxed">
                O maior portal de notícias do Flamengo. Acompanhe tudo sobre o Mais Querido em um só lugar.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 text-sm">Editorias</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-red-400 transition-colors">Notícias</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Jogos</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Transferências</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Libertadores</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Brasileirão</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 text-sm">Comunidade</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setActivePage('forum')} className="hover:text-red-400 transition-colors">Fórum</button></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Enquetes</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Sobre nós</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Política de Privacidade</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 text-sm">Redes Sociais</h4>
              <div className="flex gap-3 mb-4">
                <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <i className="fab fa-instagram text-sm"></i>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <i className="fab fa-twitter text-sm"></i>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <i className="fab fa-youtube text-sm"></i>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <i className="fab fa-tiktok text-sm"></i>
                </a>
              </div>
              <p className="text-sm">
                <i className="fas fa-envelope mr-2"></i>contato@diariorubronegro.com.br
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
            <p>© 2026 Diário Rubro-Negro. Todos os direitos reservados.</p>
            <p className="mt-1 text-xs text-gray-600">
              Site não oficial. Feito com ❤️ pela Nação Rubro-Negra.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
