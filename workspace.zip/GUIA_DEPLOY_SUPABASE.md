# 🚀 GUIA COMPLETO: SUPABASE + DEPLOY

## 📋 ÍNDICE

1. [Criar Conta no Supabase](#1-criar-conta-no-supabase)
2. [Configurar Projeto](#2-configurar-projeto)
3. [Criar Tabelas](#3-criar-tabelas)
4. [Configurar Variáveis de Ambiente](#4-configurar-variáveis-de-ambiente)
5. [Testar Conexão](#5-testar-conexão)
6. [Deploy na Vercel](#6-deploy-na-vercel)
7. [Deploy na Netlify](#7-deploy-na-netlify)
8. [Deploy Manual](#8-deploy-manual)

---

## 1. CRIAR CONTA NO SUPABASE

### Passo 1: Acessar o Supabase
- Acesse: https://supabase.com
- Clique em **"Start your project"** ou **"Sign Up"**

### Passo 2: Criar Conta
- Use sua conta GitHub (recomendado) ou email
- Complete o cadastro

### Passo 3: Criar Novo Projeto
- Clique em **"New Project"**
- Preencha:
  - **Name**: `diario-rubro-negro` (ou o nome que preferir)
  - **Database Password**: Crie uma senha forte (GUARDE ESTA SENHA!)
  - **Region**: Brazil (Southeast) - mais próximo
  - **Pricing Plan**: Free (gratuito)
- Clique em **"Create new project"**
- Aguarde ~2 minutos enquanto o projeto é criado

---

## 2. CONFIGURAR PROJETO

### Passo 1: Obter Credenciais
1. No painel do Supabase, clique em **"Settings"** (ícone de engrenagem)
2. Clique em **"API"**
3. Copie:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (chave longa)

### Passo 2: Habilitar Autenticação (Opcional)
1. Vá em **"Authentication"** > **"Providers"**
2. Habilite **"Email"**
3. Configure:
   - Confirm email: ON (recomendado)
   - Site URL: `http://localhost:5173` (desenvolvimento) ou sua URL de produção

---

## 3. CRIAR TABELAS

### Passo 1: Acessar SQL Editor
1. No painel do Supabase, clique em **"SQL Editor"** (ícone de código)
2. Clique em **"New query"**

### Passo 2: Executar Script SQL
1. Copie TODO o conteúdo do arquivo `supabase-schema.sql`
2. Cole no SQL Editor
3. Clique em **"Run"** (ou Ctrl+Enter)
4. Aguarde a execução (~5 segundos)

### Passo 3: Verificar Tabelas
1. Vá em **"Table Editor"** (ícone de tabela)
2. Você deve ver:
   - ✅ `news`
   - ✅ `profiles`
   - ✅ `forum_topics`
   - ✅ `forum_replies`

---

## 4. CONFIGURAR VARIÁVEIS DE AMBIENTE

### Opção A: Desenvolvimento Local

1. Na raiz do projeto, crie um arquivo `.env`:

```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

2. Edite o arquivo `.env` com suas credenciais:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

**IMPORTANTE**: 
- Substitua `SEU-PROJETO` pelo nome real do seu projeto
- Substitua `sua-chave-anonima-aqui` pela chave `anon public` copiada
- NÃO compartilhe este arquivo!

### Opção B: Produção (Vercel/Netlify)

Veja as seções de deploy abaixo para configurar variáveis de ambiente na plataforma.

---

## 5. TESTAR CONEXÃO

### Teste Rápido
1. Execute o projeto localmente:

```bash
npm run dev
```

2. Abra o console do navegador (F12)
3. Você deve ver: `✅ Conectado ao Supabase com sucesso!`

### Teste Manual
1. Acesse o painel admin (engrenagem ⚙️)
2. Clique em **"Nova Notícia"**
3. Preencha os campos e salve
4. Vá no **Table Editor** do Supabase
5. Verifique se a notícia foi criada na tabela `news`

---

## 6. DEPLOY NA VERCEL (RECOMENDADO)

### Passo 1: Preparar Projeto
1. Certifique-se de que o código está no GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git push -u origin main
```

### Passo 2: Conectar ao Vercel
1. Acesse: https://vercel.com
2. Clique em **"Sign Up"** (use GitHub)
3. Clique em **"Add New..."** > **"Project"**
4. Importe seu repositório do GitHub

### Passo 3: Configurar Deploy
1. **Framework Preset**: Vite
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Install Command**: `npm install`

### Passo 4: Adicionar Variáveis de Ambiente
1. Clique em **"Environment Variables"**
2. Adicione:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://SEU-PROJETO.supabase.co`
3. Adicione:
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGc...` (sua chave anon)
4. Clique em **"Save"**

### Passo 5: Deploy
1. Clique em **"Deploy"**
2. Aguarde ~2 minutos
3. Seu site estará em: `https://SEU-PROJETO.vercel.app`

### Passo 6: Domínio Customizado (Opcional)
1. Vá em **"Settings"** > **"Domains"**
2. Adicione seu domínio (ex: `diariorubronegro.com.br`)
3. Siga as instruções para configurar DNS

---

## 7. DEPLOY NA NETLIFY

### Passo 1: Preparar Projeto
Mesmo processo do Vercel (push para GitHub)

### Passo 2: Conectar ao Netlify
1. Acesse: https://netlify.com
2. Clique em **"Sign up"** (use GitHub)
3. Clique em **"Add new site"** > **"Import an existing project"**
4. Selecione seu repositório

### Passo 3: Configurar Build
1. **Build command**: `npm run build`
2. **Publish directory**: `dist`

### Passo 4: Adicionar Variáveis de Ambiente
1. Vá em **"Site settings"** > **"Environment variables"**
2. Clique em **"Add variable"**
3. Adicione:
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: `https://SEU-PROJETO.supabase.co`
4. Adicione:
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGc...` (sua chave anon)

### Passo 5: Deploy
1. Clique em **"Deploy site"**
2. Aguarde ~2 minutos
3. Seu site estará em: `https://SEU-SITE.netlify.app`

---

## 8. DEPLOY MANUAL

### Opção A: GitHub Pages

1. Instale o pacote:

```bash
npm install -D gh-pages
```

2. Adicione ao `package.json`:

```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

3. Configure o `vite.config.js`:

```javascript
export default defineConfig({
  base: '/SEU-REPO/',
  // ... resto da config
})
```

4. Deploy:

```bash
npm run build
npm run deploy
```

### Opção B: Servidor Próprio (VPS)

1. Build do projeto:

```bash
npm run build
```

2. Copie a pasta `dist` para seu servidor:

```bash
scp -r dist/* usuario@servidor:/var/www/html/
```

3. Configure Nginx/Apache para servir arquivos estáticos

---

## 🔧 CONFIGURAÇÕES ADICIONAIS

### Habilitar Storage (Para Imagens)

1. No Supabase, vá em **"Storage"**
2. Clique em **"New bucket"**
3. Nome: `news-images`
4. **Public bucket**: ON
5. Clique em **"Create bucket"**

### Configurar Policies de Storage

No SQL Editor, execute:

```sql
-- Permitir upload para usuários autenticados
CREATE POLICY "Usuários autenticados podem fazer upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'news-images');

-- Permitir leitura pública
CREATE POLICY "Imagens são públicas"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'news-images');
```

### Habilitar Realtime (Atualizações em Tempo Real)

1. No Supabase, vá em **"Database"** > **"Replication"**
2. Habilite as tabelas que deseja monitorar:
   - `news`
   - `forum_topics`
   - `forum_replies`

---

## 📊 MONITORAMENTO

### Verificar Uso do Supabase
1. Vá em **"Settings"** > **"Billing"**
2. Veja:
   - Uso de banco de dados
   - Requisições à API
   - Armazenamento
   - Autenticação

### Limites do Plano Gratuito
- **Banco de dados**: 500 MB
- **Armazenamento**: 1 GB
- **Transferência**: 2 GB/mês
- **Usuários ativos**: 50.000
- **Requisições API**: Ilimitadas

---

## 🐛 TROUBLESHOOTING

### Erro: "Failed to fetch"
- Verifique se as variáveis de ambiente estão corretas
- Confirme que o projeto Supabase está ativo
- Verifique o console do navegador para mais detalhes

### Erro: "relation does not exist"
- Execute o script SQL novamente
- Verifique se as tabelas foram criadas no Table Editor

### Erro: "new row violates row-level security policy"
- Verifique as policies de segurança
- Confirme que o usuário está autenticado
- Teste com um usuário admin

### Site não carrega após deploy
- Verifique as variáveis de ambiente na plataforma
- Confirme que o build foi bem-sucedido
- Verifique os logs de deploy

---

## 📞 SUPORTE

### Documentação Oficial
- Supabase: https://supabase.com/docs
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com

### Comunidade
- Discord Supabase: https://discord.supabase.com
- GitHub Discussions: https://github.com/supabase/supabase/discussions

---

## ✅ CHECKLIST FINAL

- [ ] Conta Supabase criada
- [ ] Projeto configurado
- [ ] Tabelas criadas (SQL executado)
- [ ] Variáveis de ambiente configuradas
- [ ] Conexão testada localmente
- [ ] Código push para GitHub
- [ ] Deploy realizado (Vercel/Netlify)
- [ ] Site acessível online
- [ ] Funcionalidades testadas
- [ ] Domínio customizado configurado (opcional)

---

## 🎉 PRONTO!

Seu site **Diário Rubro-Negro** está agora:
- ✅ Conectado ao Supabase
- ✅ Com banco de dados real
- ✅ Online e acessível
- ✅ Pronto para receber notícias reais

**Próximos passos:**
1. Configure o domínio customizado
2. Adicione mais funcionalidades
3. Divulgue seu site!
4. Comece a publicar notícias reais

---

**Boa sorte com seu projeto! 🔴⚫**
