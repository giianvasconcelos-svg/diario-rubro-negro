import { useEffect, useRef, useState } from 'react';
import App from './App';
import ContactPage from './components/ContactPage';
import { News, newsService, supabase } from './lib/supabase';
import { NewsDraft } from './data/draftNews';

type EditorRole = 'admin' | 'editor' | null;
type ExtendedDraft = NewsDraft & { sourceUrl?: string; originalTitle?: string };

const DB_MAP_KEY = 'drn_supabase_map';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function dbToDraft(row: any): ExtendedDraft {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt || '',
    content: row.content || row.excerpt || '',
    category: row.category || 'Destaque',
    author: 'Redação DRN',
    image: row.image || '',
    tags: Array.isArray(row.tags) ? row.tags : [],
    status: row.status === 'draft' ? 'pending' : row.status,
    createdAt: row.created_at || new Date().toISOString(),
    reviewedAt: row.published_at || row.updated_at || undefined,
    sourceUrl: row.source_url || undefined,
    originalTitle: row.original_title || undefined,
  };
}

function draftToNews(draft: ExtendedDraft): News {
  const publishedAt = draft.status === 'published'
    ? (draft.reviewedAt || draft.createdAt || new Date().toISOString())
    : undefined;

  return {
    title: draft.title,
    excerpt: draft.excerpt || draft.title,
    content: draft.content || draft.excerpt || draft.title,
    category: draft.category || 'Destaque',
    author: 'Redação DRN',
    image: draft.image || '',
    tags: Array.isArray(draft.tags) ? draft.tags : [],
    status: draft.status,
    source_url: draft.sourceUrl,
    original_title: draft.originalTitle,
    published_at: publishedAt,
  };
}

async function getEditorRole(): Promise<EditorRole> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error) return null;
  return data?.role === 'admin' || data?.role === 'editor' ? data.role : null;
}

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage('Não foi possível entrar. Verifique o e-mail e a senha.');
      setLoading(false);
      return;
    }

    const role = await getEditorRole();
    if (!role) {
      await supabase.auth.signOut();
      setMessage('Esta conta ainda não possui permissão de editor ou administrador.');
      setLoading(false);
      return;
    }

    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-red-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-800 to-black text-white p-6">
          <div className="text-xs font-black uppercase tracking-widest text-red-200">Diário Rubro-Negro</div>
          <h1 className="text-2xl font-black mt-1">Acesso editorial</h1>
          <p className="text-sm text-red-100 mt-2">Entre com uma conta autorizada como administrador ou editor.</p>
        </div>
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">E-mail</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-600" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Senha</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-600" />
          </div>
          {message && <div className="text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg p-3">{message}</div>}
          <button disabled={loading} className="w-full bg-red-700 hover:bg-red-800 disabled:opacity-60 text-white font-black py-3 rounded-lg transition-colors">
            {loading ? 'Entrando...' : 'Entrar no painel'}
          </button>
          <a href="/" className="block text-center text-sm text-gray-500 hover:text-red-700">← Voltar ao site</a>
        </form>
      </div>
    </div>
  );
}

function IntegrationBridge() {
  const [role, setRole] = useState<EditorRole>(null);
  const lastStorage = useRef<string | null>(null);
  const syncing = useRef(false);

  const hydrateFromSupabase = async () => {
    const { data, error } = await newsService.getAll();
    if (error || !data) return;

    const drafts = data.map(dbToDraft);
    const serialized = JSON.stringify(drafts);
    lastStorage.current = serialized;
    localStorage.setItem('drn_news', serialized);

    const map: Record<string, string> = {};
    drafts.forEach((item) => { map[item.id] = item.id; });
    localStorage.setItem(DB_MAP_KEY, JSON.stringify(map));
  };

  const syncLocalDrafts = async (serialized: string) => {
    if (syncing.current || !role) return;
    syncing.current = true;

    try {
      const drafts = JSON.parse(serialized || '[]') as ExtendedDraft[];
      const map = JSON.parse(localStorage.getItem(DB_MAP_KEY) || '{}') as Record<string, string>;

      for (const draft of drafts) {
        const payload = draftToNews(draft);
        const existingId = UUID_RE.test(draft.id) ? draft.id : map[draft.id];

        if (existingId) {
          const { error } = await newsService.update(existingId, payload);
          if (error) console.warn('Falha ao sincronizar notícia', draft.title, error);
          continue;
        }

        const { data, error } = await newsService.create(payload);
        if (!error && data?.id) {
          map[draft.id] = data.id;
        } else if (error) {
          console.warn('Falha ao criar notícia no Supabase', draft.title, error);
        }
      }

      localStorage.setItem(DB_MAP_KEY, JSON.stringify(map));
      window.dispatchEvent(new Event('drn-db-synced'));
    } finally {
      syncing.current = false;
    }
  };

  useEffect(() => {
    let active = true;

    const refreshRole = async () => {
      const nextRole = await getEditorRole();
      if (!active) return;
      setRole(nextRole);
      if (nextRole) await hydrateFromSupabase();
    };

    refreshRole();
    const { data: authListener } = supabase.auth.onAuthStateChange(() => refreshRole());

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!role) return;
      const current = localStorage.getItem('drn_news') || '[]';
      if (lastStorage.current === null) {
        lastStorage.current = current;
        return;
      }
      if (current !== lastStorage.current) {
        lastStorage.current = current;
        syncLocalDrafts(current);
      }
    }, 1200);

    return () => window.clearInterval(interval);
  }, [role]);

  useEffect(() => {
    const interceptAdmin = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest('button[title="Painel Administrativo"]');
      if (!button || role) return;

      event.preventDefault();
      event.stopPropagation();
      window.location.href = '/admin';
    };

    document.addEventListener('click', interceptAdmin, true);
    return () => document.removeEventListener('click', interceptAdmin, true);
  }, [role]);

  return null;
}

export default function SiteShell() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  if (path === '/contato') return <ContactPage />;
  if (path === '/admin') return <AdminLoginPage />;

  return (
    <>
      <IntegrationBridge />
      <App />
    </>
  );
}
