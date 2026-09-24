import { useState, useEffect } from 'react';
import { draftNews as initialDrafts, NewsDraft } from '../data/draftNews';
import NewsImporter from './NewsImporter';
import AutoNewsFetcher from './AutoNewsFetcher';

interface AdminPanelProps {
  onClose: () => void;
  onPublish: (news: NewsDraft[]) => void;
}

type Tab = 'pending' | 'approved' | 'rejected' | 'published';

export default function AdminPanel({ onClose, onPublish }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [news, setNews] = useState<NewsDraft[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsDraft | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsDraft | null>(null);
  const [showSuccess, setShowSuccess] = useState('');
  const [showImporter, setShowImporter] = useState(false);
  const [showAutoFetcher, setShowAutoFetcher] = useState(false);

  // Carregar do localStorage ou usar drafts iniciais
  useEffect(() => {
    const saved = localStorage.getItem('drn_news');
    if (saved) {
      setNews(JSON.parse(saved));
    } else {
      setNews(initialDrafts);
      localStorage.setItem('drn_news', JSON.stringify(initialDrafts));
    }
  }, []);

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    if (news.length > 0) {
      localStorage.setItem('drn_news', JSON.stringify(news));
    }
  }, [news]);

  const filteredNews = news.filter(n => n.status === activeTab);

  const handleApprove = (id: string) => {
    setNews(prev => prev.map(n => 
      n.id === id ? { ...n, status: 'approved', reviewedAt: new Date().toISOString() } : n
    ));
    showSuccessMsg('Notícia aprovada com sucesso!');
  };

  const handleReject = (id: string) => {
    setNews(prev => prev.map(n => 
      n.id === id ? { ...n, status: 'rejected', reviewedAt: new Date().toISOString() } : n
    ));
    showSuccessMsg('Notícia rejeitada.');
  };

  const handlePublish = (id: string) => {
    setNews(prev => prev.map(n => 
      n.id === id ? { ...n, status: 'published', reviewedAt: new Date().toISOString() } : n
    ));
    const published = news.filter(n => n.status === 'published' || n.id === id);
    onPublish(published);
    showSuccessMsg('Notícia publicada no site!');
  };

  const handleRepublish = (id: string) => {
    setNews(prev => prev.map(n => 
      n.id === id ? { ...n, status: 'pending', reviewedAt: undefined } : n
    ));
    showSuccessMsg('Notícia enviada para revisão novamente.');
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta notícia?')) {
      setNews(prev => prev.filter(n => n.id !== id));
      showSuccessMsg('Notícia excluída.');
    }
  };

  const handleSaveEdit = (updated: NewsDraft) => {
    setNews(prev => prev.map(n => n.id === updated.id ? updated : n));
    setEditingNews(null);
    setSelectedNews(null);
    showSuccessMsg('Notícia atualizada!');
  };

  const handleCreateNews = (newItem: Omit<NewsDraft, 'id' | 'status' | 'createdAt'>) => {
    const item: NewsDraft = {
      ...newItem,
      id: `draft-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setNews(prev => [item, ...prev]);
    setShowForm(false);
    showSuccessMsg('Nova notícia adicionada à fila de aprovação!');
  };

  const handleImportNews = (importedNews: NewsDraft) => {
    setNews(prev => [importedNews, ...prev]);
    showSuccessMsg('Notícia real importada e reformulada! Aguardando aprovação.');
  };

  const handleAutoImport = (newsBatch: NewsDraft[]) => {
    setNews(prev => [...newsBatch, ...prev]);
    showSuccessMsg(`${newsBatch.length} notícias reais importadas e reformuladas! Aguardando sua aprovação.`);
  };

  const showSuccessMsg = (msg: string) => {
    setShowSuccess(msg);
    setTimeout(() => setShowSuccess(''), 3000);
  };

  const counts = {
    pending: news.filter(n => n.status === 'pending').length,
    approved: news.filter(n => n.status === 'approved').length,
    rejected: news.filter(n => n.status === 'rejected').length,
    published: news.filter(n => n.status === 'published').length,
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4 overflow-y-auto">
      <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col my-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 via-red-900 to-black px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-user-shield text-white"></i>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Painel Administrativo</h2>
              <p className="text-red-200 text-xs">Gerencie as notícias do Diário Rubro-Negro</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl w-9 h-9 rounded-full hover:bg-white/10 transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-500 text-white px-6 py-2 text-sm flex items-center gap-2 flex-shrink-0">
            <i className="fas fa-check-circle"></i>
            {showSuccess}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white border-b flex-shrink-0">
          <div className="flex overflow-x-auto">
            {[
              { id: 'pending' as Tab, label: 'Pendentes', icon: 'fa-clock', color: 'text-yellow-600' },
              { id: 'approved' as Tab, label: 'Aprovadas', icon: 'fa-check', color: 'text-green-600' },
              { id: 'rejected' as Tab, label: 'Rejeitadas', icon: 'fa-times', color: 'text-red-600' },
              { id: 'published' as Tab, label: 'Publicadas', icon: 'fa-globe', color: 'text-blue-600' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedNews(null); setEditingNews(null); }}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-red-600 text-red-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className={`fas ${tab.icon} ${tab.color}`}></i>
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {counts[tab.id]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-gray-600">
            <span className="font-bold">{filteredNews.length}</span> notícia(s) nesta categoria
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => window.open('/copiar-sql.html', '_blank')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-2"
              title="Abrir página para copiar SQL do Supabase"
            >
              <i className="fas fa-database"></i>
              Configurar Supabase
            </button>
            <button 
              onClick={() => setShowAutoFetcher(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2"
            >
              <i className="fas fa-rss"></i>
              Buscar Notícias Automático
            </button>
            <button 
              onClick={() => setShowImporter(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2"
            >
              <i className="fas fa-file-import"></i>
              Importar Manual
            </button>
            <button 
              onClick={() => setShowForm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              Nova Notícia
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {editingNews ? (
            <NewsEditForm news={editingNews} onSave={handleSaveEdit} onCancel={() => setEditingNews(null)} />
          ) : showForm ? (
            <NewsCreateForm onCreate={handleCreateNews} onCancel={() => setShowForm(false)} />
          ) : selectedNews ? (
            <NewsDetail 
              news={selectedNews} 
              onBack={() => setSelectedNews(null)}
              onApprove={handleApprove}
              onReject={handleReject}
              onPublish={handlePublish}
              onRepublish={handleRepublish}
              onEdit={setEditingNews}
              onDelete={handleDelete}
            />
          ) : (
            <div className="p-4 md:p-6">
              {filteredNews.length === 0 ? (
                <div className="text-center py-16">
                  <i className="fas fa-inbox text-5xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500 text-lg">Nenhuma notícia nesta categoria</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {activeTab === 'pending' ? 'Todas as notícias foram revisadas!' : 'Aguarde novas notícias.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredNews.map((item) => (
                    <NewsCard 
                      key={item.id} 
                      news={item} 
                      onClick={() => setSelectedNews(item)}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      onPublish={handlePublish}
                      onRepublish={handleRepublish}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="bg-white border-t px-6 py-3 flex items-center justify-between text-xs text-gray-500 flex-shrink-0">
          <div className="flex items-center gap-4">
            <span><i className="fas fa-newspaper mr-1"></i>Total: {news.length}</span>
            <span><i className="fas fa-check-circle mr-1 text-green-500"></i>Publicadas: {counts.published}</span>
          </div>
          <span>Última atualização: {new Date().toLocaleTimeString('pt-BR')}</span>
        </div>
      </div>

      {/* News Importer Modal */}
      {showImporter && (
        <NewsImporter 
          onImport={handleImportNews}
          onClose={() => setShowImporter(false)}
        />
      )}

      {/* Auto News Fetcher Modal */}
      {showAutoFetcher && (
        <AutoNewsFetcher 
          onImport={handleAutoImport}
          onClose={() => setShowAutoFetcher(false)}
        />
      )}
    </div>
  );
}

// ============ NEWS CARD ============
function NewsCard({ 
  news, 
  onClick, 
  onApprove, 
  onReject, 
  onPublish,
  onRepublish 
}: { 
  news: NewsDraft; 
  onClick: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onPublish: (id: string) => void;
  onRepublish: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative cursor-pointer" onClick={onClick}>
        <img src={news.image} alt={news.title} className="w-full h-36 object-cover" />
        <div className="absolute top-2 left-2">
          <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {news.category}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-bold text-sm text-gray-800 leading-snug line-clamp-2 cursor-pointer hover:text-red-700 transition-colors" onClick={onClick}>
          {news.title}
        </h4>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{news.excerpt}</p>
        <div className="flex items-center justify-between mt-2 text-[10px] text-gray-400">
          <span><i className="far fa-clock mr-0.5"></i>{new Date(news.createdAt).toLocaleDateString('pt-BR')}</span>
          <span><i className="far fa-user mr-0.5"></i>{news.author}</span>
        </div>
        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
          {news.status === 'pending' && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); onApprove(news.id); }}
                className="flex-1 bg-green-50 text-green-700 border border-green-200 text-xs py-1.5 rounded hover:bg-green-100 transition-colors font-medium"
              >
                <i className="fas fa-check mr-1"></i>Aprovar
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onReject(news.id); }}
                className="flex-1 bg-red-50 text-red-700 border border-red-200 text-xs py-1.5 rounded hover:bg-red-100 transition-colors font-medium"
              >
                <i className="fas fa-times mr-1"></i>Rejeitar
              </button>
            </>
          )}
          {news.status === 'approved' && (
            <button 
              onClick={(e) => { e.stopPropagation(); onPublish(news.id); }}
              className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs py-1.5 rounded hover:bg-blue-100 transition-colors font-medium"
            >
              <i className="fas fa-globe mr-1"></i>Publicar no Site
            </button>
          )}
          {news.status === 'rejected' && (
            <button 
              onClick={(e) => { e.stopPropagation(); onRepublish(news.id); }}
              className="flex-1 bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs py-1.5 rounded hover:bg-yellow-100 transition-colors font-medium"
            >
              <i className="fas fa-redo mr-1"></i>Revisar Novamente
            </button>
          )}
          {news.status === 'published' && (
            <span className="flex-1 text-center bg-blue-50 text-blue-700 text-xs py-1.5 rounded font-medium">
              <i className="fas fa-check-circle mr-1"></i>Publicada
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ NEWS DETAIL ============
function NewsDetail({ 
  news, 
  onBack, 
  onApprove, 
  onReject, 
  onPublish, 
  onRepublish,
  onEdit,
  onDelete
}: { 
  news: NewsDraft; 
  onBack: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onPublish: (id: string) => void;
  onRepublish: (id: string) => void;
  onEdit: (news: NewsDraft) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="p-4 md:p-6">
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-red-600 mb-4 flex items-center gap-1">
        <i className="fas fa-arrow-left"></i> Voltar para lista
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <img src={news.image} alt={news.title} className="w-full h-48 md:h-64 object-cover" />
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">{news.category}</span>
            {news.tags.map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">#{tag}</span>
            ))}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">{news.title}</h2>
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b">
            <span><i className="far fa-user mr-1"></i>{news.author}</span>
            <span><i className="far fa-clock mr-1"></i>{new Date(news.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <p className="text-gray-700 font-medium mb-4 leading-relaxed">{news.excerpt}</p>
          <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
            {news.content}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 border-t px-5 py-4 flex flex-wrap items-center gap-2">
          {news.status === 'pending' && (
            <>
              <button onClick={() => onApprove(news.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                <i className="fas fa-check mr-1"></i>Aprovar
              </button>
              <button onClick={() => onReject(news.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                <i className="fas fa-times mr-1"></i>Rejeitar
              </button>
            </>
          )}
          {news.status === 'approved' && (
            <button onClick={() => onPublish(news.id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <i className="fas fa-globe mr-1"></i>Publicar no Site
            </button>
          )}
          {news.status === 'rejected' && (
            <button onClick={() => onRepublish(news.id)} className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors">
              <i className="fas fa-redo mr-1"></i>Enviar para Revisão
            </button>
          )}
          <button onClick={() => onEdit(news)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
            <i className="fas fa-edit mr-1"></i>Editar
          </button>
          <button onClick={() => onDelete(news.id)} className="bg-gray-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors ml-auto">
            <i className="fas fa-trash mr-1"></i>Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ NEWS EDIT FORM ============
function NewsEditForm({ news, onSave, onCancel }: { news: NewsDraft; onSave: (n: NewsDraft) => void; onCancel: () => void }) {
  const [form, setForm] = useState(news);

  return (
    <div className="p-4 md:p-6">
      <button onClick={onCancel} className="text-sm text-gray-500 hover:text-red-600 mb-4 flex items-center gap-1">
        <i className="fas fa-arrow-left"></i> Voltar
      </button>
      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="fas fa-edit text-red-600"></i> Editar Notícia
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Título</label>
            <input 
              type="text" 
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Categoria</label>
              <select 
                value={form.category}
                onChange={(e) => setForm({...form, category: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {['Jogos', 'Destaque', 'Treino', 'Mercado', 'Base', 'Análise', 'Torcida', 'Departamento Médico', 'Libertadores', 'Entrevista', 'Estatísticas', 'Maracanã'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Autor</label>
              <input 
                type="text" 
                value={form.author}
                onChange={(e) => setForm({...form, author: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">URL da Imagem</label>
            <input 
              type="text" 
              value={form.image}
              onChange={(e) => setForm({...form, image: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Resumo</label>
            <textarea 
              value={form.excerpt}
              onChange={(e) => setForm({...form, excerpt: e.target.value})}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Conteúdo Completo</label>
            <textarea 
              value={form.content}
              onChange={(e) => setForm({...form, content: e.target.value})}
              rows={8}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Tags (separadas por vírgula)</label>
            <input 
              type="text" 
              value={form.tags.join(', ')}
              onChange={(e) => setForm({...form, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button onClick={() => onSave(form)} className="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-red-700 transition-colors">
              <i className="fas fa-save mr-1"></i>Salvar Alterações
            </button>
            <button onClick={onCancel} className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ NEWS CREATE FORM ============
function NewsCreateForm({ onCreate, onCancel }: { onCreate: (n: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Jogos',
    author: 'Redação DRN',
    image: '',
    tags: [] as string[]
  });

  const handleSubmit = () => {
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      alert('Preencha título, resumo e conteúdo!');
      return;
    }
    onCreate(form);
  };

  return (
    <div className="p-4 md:p-6">
      <button onClick={onCancel} className="text-sm text-gray-500 hover:text-red-600 mb-4 flex items-center gap-1">
        <i className="fas fa-arrow-left"></i> Voltar
      </button>
      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="fas fa-plus-circle text-red-600"></i> Criar Nova Notícia
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Título *</label>
            <input 
              type="text" 
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              placeholder="Digite um título chamativo..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Categoria</label>
              <select 
                value={form.category}
                onChange={(e) => setForm({...form, category: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {['Jogos', 'Destaque', 'Treino', 'Mercado', 'Base', 'Análise', 'Torcida', 'Departamento Médico', 'Libertadores', 'Entrevista', 'Estatísticas', 'Maracanã'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Autor</label>
              <input 
                type="text" 
                value={form.author}
                onChange={(e) => setForm({...form, author: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">URL da Imagem</label>
            <input 
              type="text" 
              value={form.image}
              onChange={(e) => setForm({...form, image: e.target.value})}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {form.image && (
              <img src={form.image} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" onError={(e) => (e.currentTarget.style.display = 'none')} />
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Resumo *</label>
            <textarea 
              value={form.excerpt}
              onChange={(e) => setForm({...form, excerpt: e.target.value})}
              placeholder="Um resumo atrativo da notícia..."
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Conteúdo Completo *</label>
            <textarea 
              value={form.content}
              onChange={(e) => setForm({...form, content: e.target.value})}
              placeholder="Escreva o conteúdo completo da notícia..."
              rows={8}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Tags (separadas por vírgula)</label>
            <input 
              type="text" 
              value={form.tags.join(', ')}
              onChange={(e) => setForm({...form, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
              placeholder="Ex: Brasileirão, Maracanã, Atuação"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button onClick={handleSubmit} className="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-red-700 transition-colors">
              <i className="fas fa-paper-plane mr-1"></i>Criar e Enviar para Aprovação
            </button>
            <button onClick={onCancel} className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
