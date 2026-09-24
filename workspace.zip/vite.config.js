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

export default defineConfig({
  plugins: [editorialAppPatch(), react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});
