import { useState } from 'react';
import { reformulateNews, NewsSource, ReformulatedNews } from '../utils/newsReformulator';
import { NewsDraft } from '../data/draftNews';

interface NewsImporterProps {
  onImport: (news: NewsDraft) => void;
  onClose: () => void;
}

export default function NewsImporter({ onImport, onClose }: NewsImporterProps) {
  const [step, setStep] = useState<'input' | 'preview'>('input');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [reformulated, setReformulated] = useState<ReformulatedNews | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedExcerpt, setEditedExcerpt] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editedTags, setEditedTags] = useState<string[]>([]);

  const handleReformulate = () => {
    if (!originalTitle.trim() || !originalContent.trim()) {
      alert('Por favor, preencha o título e o conteúdo da notícia original.');
      return;
    }

    const source: NewsSource = {
      originalTitle,
      originalContent,
      source: sourceName || sourceUrl || 'Fonte externa'
    };

    const result = reformulateNews(source);
    setReformulated(result);
    setEditedTitle(result.title);
    setEditedExcerpt(result.excerpt);
    setEditedContent(result.content);
    setEditedCategory(result.category);
    setEditedTags(result.tags);
    setStep('preview');
  };

  const handleImport = () => {
    const news: NewsDraft = {
      id: `imported-${Date.now()}`,
      title: editedTitle,
      excerpt: editedExcerpt,
      content: editedContent,
      category: editedCategory,
      author: 'Redação DRN',
      image: imageUrl || 'https://image.qwenlm.ai/generated-images/7f7a7ab0-72d8-460c-99dc-d2efe20a81c1/_result.png',
      tags: editedTags,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    onImport(news);
    onClose();
  };

  const handleRegenerate = () => {
    if (reformulated) {
      const result = reformulateNews({
        originalTitle,
        originalContent,
        source: sourceName || sourceUrl || 'Fonte externa'
      });
      setReformulated(result);
      setEditedTitle(result.title);
      setEditedExcerpt(result.excerpt);
      setEditedContent(result.content);
      setEditedCategory(result.category);
      setEditedTags(result.tags);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col my-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-purple-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <i className="fas fa-file-import text-white"></i>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Importar Notícia Real</h2>
              <p className="text-blue-100 text-xs">Cole notícias reais e reformule automaticamente</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl w-9 h-9 rounded-full hover:bg-white/10 transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'input' ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
                  <div className="text-sm text-blue-800">
                    <p className="font-bold mb-1">Como usar:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>Acesse um site de notícias (ge.globo.com, espn.com.br, etc.)</li>
                      <li>Copie o título e o conteúdo da notícia sobre o Flamengo</li>
                      <li>Cole aqui e o sistema vai reformular automaticamente</li>
                      <li>Revise o resultado e ajuste se necessário</li>
                      <li>Importe para o painel de aprovação</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">URL da Notícia Original (opcional)</label>
                <input 
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://ge.globo.com/..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nome da Fonte (opcional)</label>
                <input 
                  type="text"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="Ex: ge.globo, ESPN, UOL Esporte"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Título da Notícia Original *</label>
                <textarea 
                  value={originalTitle}
                  onChange={(e) => setOriginalTitle(e.target.value)}
                  placeholder="Cole aqui o título da notícia original..."
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Conteúdo da Notícia Original *</label>
                <textarea 
                  value={originalContent}
                  onChange={(e) => setOriginalContent(e.target.value)}
                  placeholder="Cole aqui o conteúdo completo da notícia original..."
                  rows={12}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-xs"
                />
                <p className="text-xs text-gray-500 mt-1">
                  <i className="fas fa-lightbulb text-yellow-500 mr-1"></i>
                  Dica: Cole todo o texto da notícia, incluindo subtítulos e parágrafos
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">URL da Imagem (opcional)</label>
                <input 
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {imageUrl && (
                  <img src={imageUrl} alt="Preview" className="mt-2 w-full h-40 object-cover rounded-lg" onError={(e) => (e.currentTarget.style.display = 'none')} />
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button 
                  onClick={handleReformulate}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold text-sm hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  <i className="fas fa-magic mr-2"></i>
                  Reformular Notícia
                </button>
                <button 
                  onClick={onClose}
                  className="px-5 py-3 border border-gray-300 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-green-600 mt-0.5"></i>
                  <div className="text-sm text-green-800">
                    <p className="font-bold mb-1">Notícia reformulada com sucesso!</p>
                    <p className="text-xs">Revise o conteúdo abaixo e ajuste se necessário antes de importar.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Título Reformulado</label>
                <input 
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Categoria</label>
                <select 
                  value={editedCategory}
                  onChange={(e) => setEditedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {['Jogos', 'Destaque', 'Treino', 'Mercado', 'Base', 'Análise', 'Torcida', 'Departamento Médico', 'Libertadores', 'Entrevista', 'Estatísticas', 'Maracanã'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Resumo</label>
                <textarea 
                  value={editedExcerpt}
                  onChange={(e) => setEditedExcerpt(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Conteúdo Completo</label>
                <textarea 
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={10}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tags (separadas por vírgula)</label>
                <input 
                  type="text"
                  value={editedTags.join(', ')}
                  onChange={(e) => setEditedTags(e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button 
                  onClick={handleImport}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-green-700 transition-colors"
                >
                  <i className="fas fa-check mr-2"></i>
                  Importar para Aprovação
                </button>
                <button 
                  onClick={handleRegenerate}
                  className="bg-yellow-500 text-white px-5 py-3 rounded-lg font-medium text-sm hover:bg-yellow-600 transition-colors"
                  title="Gerar nova versão reformulada"
                >
                  <i className="fas fa-redo mr-1"></i>
                  Reformular Novamente
                </button>
                <button 
                  onClick={() => setStep('input')}
                  className="px-5 py-3 border border-gray-300 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Voltar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
