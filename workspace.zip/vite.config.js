import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function editorialAppPatch() {
  return {
    name: 'drn-editorial-app-patch',
    enforce: 'pre',
    transform(code, id) {
      if (!/[\\/]src[\\/]App\.tsx$/.test(id)) return null;

      const replaceRequired = (source, replacement, label) => {
        if (!code.includes(source)) {
          throw new Error(`[drn-editorial-app-patch] Não foi possível aplicar: ${label}`);
        }
        code = code.replace(source, replacement);
      };

      replaceRequired(
        "import { NewsDraft, draftNews as initialDrafts } from './data/draftNews';",
        "import { NewsDraft, draftNews as initialDrafts } from './data/draftNews';\nimport { newsService } from './lib/supabase';",
        'import do Supabase'
      );

      replaceRequired('author: "Carlos Mendes"', 'author: "Redação DRN"', 'assinatura editorial');
      replaceRequired("{ name: 'Vídeos', page: 'home' as const },", "{ name: 'Contato', page: 'home' as const },", 'aba Contato');

      replaceRequired(
        "onClick={() => { setActivePage(item.page); setMenuOpen(false); }}",
        "onClick={() => { if (item.name === 'Contato') { window.location.href = '/contato'; return; } setActivePage(item.page); setMenuOpen(false); }}",
        'navegação de Contato'
      );

      const pendingEffect = `  // Contar notícias pendentes ao carregar\n  useEffect(() => {\n    const saved = localStorage.getItem('drn_news');\n    if (saved) {\n      const allNews = JSON.parse(saved);\n      setPendingCount(allNews.filter((n: NewsDraft) => n.status === 'pending').length);\n    } else {\n      setPendingCount(initialDrafts.filter(n => n.status === 'pending').length);\n    }\n  }, []);`;

      const supabaseHydration = `${pendingEffect}\n\n  // Carregar matérias publicadas diretamente do Supabase\n  useEffect(() => {\n    let active = true;\n\n    newsService.getPublished(20).then(({ data, error }) => {\n      if (!active || error || !data) return;\n      const published = data.map((item: any): NewsDraft => ({\n        id: item.id,\n        title: item.title,\n        excerpt: item.excerpt || '',\n        content: item.content || item.excerpt || '',\n        category: item.category || 'Destaque',\n        author: 'Redação DRN',\n        image: item.image || '',\n        tags: Array.isArray(item.tags) ? item.tags : [],\n        status: 'published',\n        createdAt: item.created_at || new Date().toISOString(),\n        reviewedAt: item.published_at || item.updated_at || undefined,\n      }));\n      setPublishedNews(published);\n    });\n\n    const refresh = () => {\n      newsService.getPublished(20).then(({ data, error }) => {\n        if (!active || error || !data) return;\n        setPublishedNews(data.map((item: any): NewsDraft => ({\n          id: item.id,\n          title: item.title,\n          excerpt: item.excerpt || '',\n          content: item.content || item.excerpt || '',\n          category: item.category || 'Destaque',\n          author: 'Redação DRN',\n          image: item.image || '',\n          tags: Array.isArray(item.tags) ? item.tags : [],\n          status: 'published',\n          createdAt: item.created_at || new Date().toISOString(),\n          reviewedAt: item.published_at || item.updated_at || undefined,\n        })));\n      });\n    };\n\n    window.addEventListener('drn-db-synced', refresh);\n    return () => {\n      active = false;\n      window.removeEventListener('drn-db-synced', refresh);\n    };\n  }, []);`;

      replaceRequired(pendingEffect, supabaseHydration, 'carregamento de matérias do Supabase');
      replaceRequired('Publicadas pelo Editor', 'Últimas da Redação', 'título da seção publicada');

      replaceRequired(
        '<article key={pubNews.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer group border-l-4 border-green-600">',
        '<article key={pubNews.id} onClick={() => { window.location.href = `/noticias/${pubNews.id}`; }} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer group border-l-4 border-green-600">',
        'links permanentes das matérias'
      );

      return { code, map: null };
    },
  };
}

function adsenseEditorialGuardPatch() {
  const marker = 'Revisão editorial pendente';

  return {
    name: 'drn-adsense-editorial-guard',
    enforce: 'pre',
    transform(code, id) {
      if (/[\\/]src[\\/]components[\\/]AutoNewsFetcher\.tsx$/.test(id)) {
        const source = 'tags: reform.tags,';
        const replacement = `tags: Array.from(new Set([...reform.tags, '${marker}'])),`;
        if (!code.includes(source)) throw new Error('[drn-adsense-editorial-guard] AutoNewsFetcher mudou; revisão necessária');
        return { code: code.replace(source, replacement), map: null };
      }

      if (/[\\/]src[\\/]components[\\/]NewsImporter\.tsx$/.test(id)) {
        const source = 'tags: editedTags,';
        const replacement = `tags: Array.from(new Set([...editedTags, '${marker}'])),`;
        if (!code.includes(source)) throw new Error('[drn-adsense-editorial-guard] NewsImporter mudou; revisão necessária');
        return { code: code.replace(source, replacement), map: null };
      }

      if (!/[\\/]src[\\/]components[\\/]AdminPanel\.tsx$/.test(id)) return null;

      const approveSource = `  const handleApprove = (id: string) => {\n    setNews(prev => prev.map(n => \n      n.id === id ? { ...n, status: 'approved', reviewedAt: new Date().toISOString() } : n\n    ));\n    showSuccessMsg('Notícia aprovada com sucesso!');\n  };`;

      const approveReplacement = `  const handleApprove = (id: string) => {\n    const item = news.find(n => n.id === id);\n    if (!item) return;\n    if (item.tags.includes('${marker}')) {\n      setEditingNews(item);\n      showSuccessMsg('Revisão editorial obrigatória: edite a matéria, acrescente contexto próprio e confirme a revisão antes de aprovar.');\n      return;\n    }\n    if ((item.content || '').trim().length < 700) {\n      setEditingNews(item);\n      showSuccessMsg('Padrão editorial interno: amplie a matéria para pelo menos 700 caracteres de conteúdo útil antes de aprovar.');\n      return;\n    }\n    setNews(prev => prev.map(n => \n      n.id === id ? { ...n, status: 'approved', reviewedAt: new Date().toISOString() } : n\n    ));\n    showSuccessMsg('Notícia aprovada com sucesso!');\n  };`;

      if (!code.includes(approveSource)) throw new Error('[drn-adsense-editorial-guard] handleApprove mudou; revisão necessária');
      code = code.replace(approveSource, approveReplacement);

      const stateSource = `function NewsEditForm({ news, onSave, onCancel }: { news: NewsDraft; onSave: (n: NewsDraft) => void; onCancel: () => void }) {\n  const [form, setForm] = useState(news);`;
      const stateReplacement = `function NewsEditForm({ news, onSave, onCancel }: { news: NewsDraft; onSave: (n: NewsDraft) => void; onCancel: () => void }) {\n  const [form, setForm] = useState(news);\n  const needsEditorialReview = form.tags.includes('${marker}');\n  const [editorialConfirmed, setEditorialConfirmed] = useState(!needsEditorialReview);\n\n  const saveWithReview = () => {\n    if (needsEditorialReview && !editorialConfirmed) {\n      alert('Confirme a revisão editorial antes de salvar esta matéria importada.');\n      return;\n    }\n    const tags = editorialConfirmed ? form.tags.filter(tag => tag !== '${marker}') : form.tags;\n    onSave({ ...form, tags, reviewedBy: editorialConfirmed ? 'Revisão editorial humana' : form.reviewedBy });\n  };`;

      if (!code.includes(stateSource)) throw new Error('[drn-adsense-editorial-guard] NewsEditForm mudou; revisão necessária');
      code = code.replace(stateSource, stateReplacement);

      const buttonSource = `          <div className="flex items-center gap-3 pt-2">\n            <button onClick={() => onSave(form)} className="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-red-700 transition-colors">`;
      const buttonReplacement = `          {needsEditorialReview && (\n            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">\n              <div className="font-bold text-amber-900 text-sm mb-2">Revisão humana obrigatória para conteúdo importado</div>\n              <p className="text-xs text-amber-800 mb-3">Confira os fatos, reescreva com linguagem própria e acrescente contexto ou análise útil da Redação DRN. Apenas trocar palavras ou sinônimos não é suficiente.</p>\n              <label className="flex items-start gap-2 text-sm text-amber-900 cursor-pointer">\n                <input type="checkbox" checked={editorialConfirmed} onChange={(e) => setEditorialConfirmed(e.target.checked)} className="mt-0.5" />\n                <span>Confirmo que revisei os fatos e acrescentei contribuição editorial própria antes da publicação.</span>\n              </label>\n            </div>\n          )}\n          <div className="flex items-center gap-3 pt-2">\n            <button onClick={saveWithReview} className="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-red-700 transition-colors">`;

      if (!code.includes(buttonSource)) throw new Error('[drn-adsense-editorial-guard] botão de salvar mudou; revisão necessária');
      code = code.replace(buttonSource, buttonReplacement);

      return { code, map: null };
    },
  };
}

export default defineConfig({
  plugins: [adsenseEditorialGuardPatch(), editorialAppPatch(), react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});
