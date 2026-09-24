import { createClient } from '@supabase/supabase-js';

// ============================================
// CONFIGURAÇÃO DO SUPABASE
// ============================================
// IMPORTANTE: Substitua os valores abaixo pelas suas credenciais do Supabase
// Você encontra essas informações em: Settings > API no painel do Supabase

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://SEU-PROJETO.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'SUA-CHAVE-ANONIMA';

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// TIPOS DE DADOS
// ============================================

export interface News {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image: string;
  tags: string[];
  status: 'draft' | 'pending' | 'approved' | 'published' | 'rejected';
  source_url?: string;
  original_title?: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  views?: number;
}

export interface ForumTopic {
  id?: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  category: string;
  tags: string[];
  pinned: boolean;
  hot: boolean;
  replies_count: number;
  views: number;
  last_reply_at?: string;
  last_reply_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ForumReply {
  id?: string;
  topic_id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  role: 'admin' | 'editor' | 'user';
  posts_count: number;
  level: string;
  created_at?: string;
}

// ============================================
// SERVIÇOS DE NOTÍCIAS
// ============================================

export const newsService = {
  // Buscar todas as notícias
  async getAll(status?: string) {
    let query = supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Buscar notícias publicadas
  async getPublished(limit = 20) {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit);

    return { data, error };
  },

  // Buscar notícia por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  },

  // Criar nova notícia
  async create(news: News) {
    const { data, error } = await supabase
      .from('news')
      .insert([news])
      .select()
      .single();

    return { data, error };
  },

  // Atualizar notícia
  async update(id: string, updates: Partial<News>) {
    const { data, error } = await supabase
      .from('news')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Aprovar notícia
  async approve(id: string) {
    return this.update(id, { status: 'approved' });
  },

  // Publicar notícia
  async publish(id: string) {
    return this.update(id, {
      status: 'published',
      published_at: new Date().toISOString()
    });
  },

  // Rejeitar notícia
  async reject(id: string) {
    return this.update(id, { status: 'rejected' });
  },

  // Deletar notícia
  async delete(id: string) {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    return { error };
  },

  // Incrementar visualizações
  async incrementViews(id: string) {
    const { data: news } = await this.getById(id);
    if (news) {
      return this.update(id, { views: (news.views || 0) + 1 });
    }
  }
};

// ============================================
// SERVIÇOS DE AUTENTICAÇÃO
// ============================================

export const authService = {
  // Login
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    return { data, error };
  },

  // Registro
  async signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username
        }
      }
    });

    return { data, error };
  },

  // Logout
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Usuário atual
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Recuperar senha
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  }
};

// ============================================
// SERVIÇOS DO FÓRUM
// ============================================

export const forumService = {
  // Buscar todos os tópicos
  async getTopics(category?: string, limit = 50) {
    let query = supabase
      .from('forum_topics')
      .select('*')
      .order('pinned', { ascending: false })
      .order('last_reply_at', { ascending: false, nullsFirst: false })
      .limit(limit);

    if (category && category !== 'todos') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Buscar tópico por ID
  async getTopicById(id: string) {
    const { data, error } = await supabase
      .from('forum_topics')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  },

  // Criar novo tópico
  async createTopic(topic: ForumTopic) {
    const { data, error } = await supabase
      .from('forum_topics')
      .insert([topic])
      .select()
      .single();

    return { data, error };
  },

  // Buscar respostas de um tópico
  async getReplies(topicId: string) {
    const { data, error } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('topic_id', topicId)
      .order('created_at', { ascending: true });

    return { data, error };
  },

  // Criar resposta
  async createReply(reply: ForumReply) {
    const { data, error } = await supabase
      .from('forum_replies')
      .insert([reply])
      .select()
      .single();

    return { data, error };
  },

  // Incrementar visualizações do tópico
  async incrementViews(topicId: string) {
    const { data: topic } = await this.getTopicById(topicId);
    if (topic) {
      const { error } = await supabase
        .from('forum_topics')
        .update({ views: topic.views + 1 })
        .eq('id', topicId);

      return { error };
    }
  }
};

// ============================================
// SERVIÇOS DE PERFIL
// ============================================

export const profileService = {
  // Buscar perfil
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return { data, error };
  },

  // Criar perfil
  async createProfile(profile: UserProfile) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profile])
      .select()
      .single();

    return { data, error };
  },

  // Atualizar perfil
  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  },

  // Top membros
  async getTopMembers(limit = 10) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('posts_count', { ascending: false })
      .limit(limit);

    return { data, error };
  }
};

// ============================================
// VERIFICAR CONEXÃO
// ============================================

export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Erro ao conectar com Supabase:', error);
      return false;
    }

    console.log('✅ Conectado ao Supabase com sucesso!');
    return true;
  } catch (err) {
    console.error('❌ Erro de conexão:', err);
    return false;
  }
}
