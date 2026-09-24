-- ============================================
-- SCRIPT SQL PARA CRIAR TABELAS NO SUPABASE
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- Acesse: https://supabase.com/dashboard/ > Seu Projeto > SQL Editor

-- ============================================
-- TABELA: NEWS (Notícias)
-- ============================================
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Redação DRN',
  image TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'published', 'rejected')),
  source_url TEXT,
  original_title TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);

-- ============================================
-- TABELA: PROFILES (Perfis de Usuários)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')),
  posts_count INTEGER DEFAULT 0,
  level TEXT DEFAULT 'Novato',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_posts_count ON profiles(posts_count DESC);

-- ============================================
-- TABELA: FORUM_TOPICS (Tópicos do Fórum)
-- ============================================
CREATE TABLE IF NOT EXISTS forum_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'geral',
  tags TEXT[] DEFAULT '{}',
  pinned BOOLEAN DEFAULT FALSE,
  hot BOOLEAN DEFAULT FALSE,
  replies_count INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  last_reply_at TIMESTAMP WITH TIME ZONE,
  last_reply_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forum_topics_category ON forum_topics(category);
CREATE INDEX IF NOT EXISTS idx_forum_topics_pinned ON forum_topics(pinned DESC);
CREATE INDEX IF NOT EXISTS idx_forum_topics_created_at ON forum_topics(created_at DESC);

-- ============================================
-- TABELA: FORUM_REPLIES (Respostas do Fórum)
-- ============================================
CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forum_replies_topic_id ON forum_replies(topic_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_created_at ON forum_replies(created_at);

-- ============================================
-- FUNÇÕES E TRIGGERS
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para news
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para forum_topics
CREATE TRIGGER update_forum_topics_updated_at
  BEFORE UPDATE ON forum_topics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para forum_replies
CREATE TRIGGER update_forum_replies_updated_at
  BEFORE UPDATE ON forum_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNÇÃO: Criar perfil automaticamente ao registrar
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, username, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil ao registrar usuário
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- FUNÇÃO: Atualizar contagem de respostas
-- ============================================
CREATE OR REPLACE FUNCTION update_replies_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_topics
    SET 
      replies_count = replies_count + 1,
      last_reply_at = NEW.created_at,
      last_reply_by = NEW.author_name
    WHERE id = NEW.topic_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_topics
    SET replies_count = replies_count - 1
    WHERE id = OLD.topic_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar contagem de respostas
CREATE TRIGGER update_forum_replies_count
  AFTER INSERT OR DELETE ON forum_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_replies_count();

-- ============================================
-- POLICY DE SEGURANÇA (RLS - Row Level Security)
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES: NEWS
-- ============================================

-- Todos podem ver notícias publicadas
CREATE POLICY "Notícias publicadas são visíveis para todos"
  ON news FOR SELECT
  USING (status = 'published');

-- Admins e editores podem ver todas as notícias
CREATE POLICY "Admins e editores veem todas as notícias"
  ON news FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Apenas admins e editores podem criar notícias
CREATE POLICY "Apenas admins e editores podem criar notícias"
  ON news FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Apenas admins e editores podem atualizar notícias
CREATE POLICY "Apenas admins e editores podem atualizar notícias"
  ON news FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Apenas admins podem deletar notícias
CREATE POLICY "Apenas admins podem deletar notícias"
  ON news FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- POLICIES: PROFILES
-- ============================================

-- Todos podem ver perfis
CREATE POLICY "Perfis são visíveis para todos"
  ON profiles FOR SELECT
  USING (true);

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "Usuários podem atualizar próprio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- POLICIES: FORUM_TOPICS
-- ============================================

-- Todos podem ver tópicos
CREATE POLICY "Tópicos são visíveis para todos"
  ON forum_topics FOR SELECT
  USING (true);

-- Usuários autenticados podem criar tópicos
CREATE POLICY "Usuários autenticados podem criar tópicos"
  ON forum_topics FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Usuários podem atualizar seus próprios tópicos
CREATE POLICY "Usuários podem atualizar próprios tópicos"
  ON forum_topics FOR UPDATE
  USING (auth.uid() = author_id);

-- ============================================
-- POLICIES: FORUM_REPLIES
-- ============================================

-- Todos podem ver respostas
CREATE POLICY "Respostas são visíveis para todos"
  ON forum_replies FOR SELECT
  USING (true);

-- Usuários autenticados podem criar respostas
CREATE POLICY "Usuários autenticados podem criar respostas"
  ON forum_replies FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- ============================================
-- DADOS INICIAIS (OPCIONAL)
-- ============================================

-- Inserir algumas notícias de exemplo
INSERT INTO news (title, excerpt, content, category, author, image, tags, status)
VALUES 
(
  'Bem-vindo ao Diário Rubro-Negro!',
  'Este é o primeiro post do seu novo site de notícias do Flamengo.',
  'Parabéns! Seu site está configurado e pronto para uso. Agora você pode começar a adicionar notícias reais sobre o Flamengo usando o painel administrativo.',
  'Destaque',
  'Admin',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
  ARRAY['Bem-vindo', 'Início'],
  'published'
);

-- ============================================
-- FIM DO SCRIPT
-- ============================================
-- Após executar este script, suas tabelas estarão prontas para uso!
-- Lembre-se de configurar as variáveis de ambiente no seu projeto.
