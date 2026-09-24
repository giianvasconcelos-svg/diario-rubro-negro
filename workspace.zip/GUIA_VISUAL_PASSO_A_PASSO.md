# 📸 GUIA VISUAL PASSO A PASSO - SUPABASE

## 🎯 ONDE VOCÊ ESTÁ AGORA:
Você está em **Settings > API Keys** do Supabase. Perfeito! Vamos continuar!

---

## 📋 PASSO 1: COPIAR AS CREDENCIAIS

### Na tela de API Keys, você vai ver 2 coisas importantes:

```
┌─────────────────────────────────────────────────────────┐
│  Settings > API Keys                                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Project URL:                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │ https://abcdefghijk.supabase.co         [Copy] │   │  ← COPIE ISTO!
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  API Keys:                                              │
│                                                         │
│  anon public                                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [Copy] │   │  ← COPIE ISTO!
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  service_role                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [Copy] │   │  ← NÃO PRECISA!
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### ✅ O QUE COPIAR:

1. **Project URL** → Clique no botão **[Copy]** ao lado
   - Vai ser algo como: `https://abcdefghijk.supabase.co`
   - **COLE EM UM BLOCO DE NOTAS** (vai precisar depois)

2. **anon public** → Clique no botão **[Copy]** ao lado
   - Vai ser algo como: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3Mi...`
   - **COLE NO MESMO BLOCO DE NOTAS**

⚠️ **IMPORTANTE**: 
- Use a chave **anon public** (NÃO use a service_role!)
- A anon public é a chave pública, segura para usar no frontend
- A service_role é secreta e NÃO deve ser usada no site

---

## 📋 PASSO 2: CRIAR AS TABELAS NO BANCO

### Agora vamos criar as tabelas no Supabase:

1. No menu lateral esquerdo do Supabase, procure o ícone **</> SQL Editor**
   - Parece um ícone de código
   - Clique nele

2. Na tela do SQL Editor:
   ```
   ┌─────────────────────────────────────────────────────────┐
   │  SQL Editor                                             │
   ├─────────────────────────────────────────────────────────┤
   │                                                         │
   │  ┌─────────────────────────────────────────────────┐   │
   │  │ + New query                                      │   │  ← CLIQUE AQUI!
   │  └─────────────────────────────────────────────────┘   │
   │                                                         │
   │  ┌─────────────────────────────────────────────────┐   │
   │  │                                                  │   │
   │  │   (área para colar o código SQL)                │   │  ← COLE AQUI!
   │  │                                                  │   │
   │  │                                                  │   │
   │  └─────────────────────────────────────────────────┘   │
   │                                                         │
   │  ┌─────────────────────────────────────────────────┐   │
   │  │ Run                                      [⌘+↵] │   │  ← CLIQUE AQUI!
   │  └─────────────────────────────────────────────────┘   │
   │                                                         │
   └─────────────────────────────────────────────────────────┘
   ```

3. Clique em **"+ New query"**

4. Abra o arquivo **`supabase-schema.sql`** que está na pasta do projeto

5. **Copie TODO o conteúdo** do arquivo (Ctrl+A, Ctrl+C)

6. **Cole na área do SQL Editor** (Ctrl+V)

7. Clique no botão **"Run"** (ou pressione Ctrl+Enter)

8. Aguarde ~5 segundos. Você deve ver:
   ```
   ✅ Success. No rows returned.
   ```

### Verificar se funcionou:

1. No menu lateral, clique em **🗃️ Table Editor** (ícone de tabela)
2. Você deve ver 4 tabelas:
   - ✅ `forum_replies`
   - ✅ `forum_topics`
   - ✅ `news`
   - ✅ `profiles`

Se aparecer as 4 tabelas, **funcionou!** 🎉

---

## 📋 PASSO 3: CONFIGURAR O PROJETO LOCAL

### Agora vamos configurar seu projeto para se conectar ao Supabase:

### Opção A: Se você está editando os arquivos

1. Na pasta do seu projeto, procure o arquivo **`.env.example`**

2. **Renomeie** ele para **`.env`** (remova o .example)
   - Ou crie um novo arquivo chamado `.env`

3. Abra o arquivo `.env` e cole suas credenciais:

```env
# ============================================
# CONFIGURAÇÃO DO SUPABASE
# ============================================

# Cole aqui o Project URL que você copiou:
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co

# Cole aqui a chave anon public que você copiou:
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3Mi...
```

⚠️ **IMPORTANTE**:
- NÃO coloque aspas ("") nos valores
- NÃO coloque espaços antes ou depois
- O `VITE_` no início é obrigatório!

### Exemplo REAL (com dados fictícios):

```env
VITE_SUPABASE_URL=https://xyzabcdefg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emFiY2RlZmc
```

4. **Salve o arquivo** (Ctrl+S)

---

## 📋 PASSO 4: TESTAR LOCALMENTE

1. Abra o terminal na pasta do projeto

2. Execute:
```bash
npm run dev
```

3. Abra o site no navegador (geralmente http://localhost:5173)

4. Abra o **Console do navegador** (F12 > aba Console)

5. Você deve ver:
```
✅ Conectado ao Supabase com sucesso!
```

Se aparecer isso, **funcionou!** 🎉

Se aparecer erro, veja a seção de Troubleshooting abaixo.

---

## 📋 PASSO 5: COLOCAR NO AR (DEPLOY)

### Opção RECOMENDADA: Vercel

1. Acesse: https://vercel.com

2. Clique em **"Sign Up"** → Use sua conta GitHub

3. Clique em **"Add New..."** → **"Project"**

4. Encontre seu repositório e clique em **"Import"**

5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. **ANTES DE CLICAR EM DEPLOY**, expanda a seção **"Environment Variables"**

7. Adicione as variáveis:

   ```
   ┌─────────────────────────────────────────────────────────┐
   │  Environment Variables                                  │
   ├─────────────────────────────────────────────────────────┤
   │                                                         │
   │  ┌──────────────────────┐  ┌────────────────────────┐  │
   │  │ VITE_SUPABASE_URL    │  │ https://xyz.supabase.co│  │
   │  └──────────────────────┘  └────────────────────────┘  │
   │                                                         │
   │  ┌──────────────────────┐  ┌────────────────────────┐  │
   │  │ VITE_SUPABASE_ANON_  │  │ eyJhbGciOiJIUzI1Ni...  │  │
   │  │ KEY                  │  │                        │  │
   │  └──────────────────────┘  └────────────────────────┘  │
   │                                                         │
   │  [+ Add New]                                            │
   │                                                         │
   └─────────────────────────────────────────────────────────┘
   ```

   Clique em **"+ Add New"** para adicionar a segunda variável

8. Clique em **"Deploy"**

9. Aguarde ~2 minutos

10. Pronto! Seu site estará em: `https://seu-projeto.vercel.app`

---

## 🆘 TROUBLESHOOTING (Problemas Comuns)

### ❌ "Failed to fetch" ou erro de conexão

**Causa**: Variáveis de ambiente incorretas

**Solução**:
1. Verifique se o arquivo `.env` existe na raiz do projeto
2. Verifique se os nomes estão corretos:
   - `VITE_SUPABASE_URL` (com VITE_ na frente!)
   - `VITE_SUPABASE_ANON_KEY` (com VITE_ na frente!)
3. Verifique se não tem espaços ou aspas
4. Reinicie o servidor: `npm run dev`

### ❌ "relation does not exist"

**Causa**: Tabelas não foram criadas

**Solução**:
1. Volte ao SQL Editor do Supabase
2. Cole o script novamente
3. Clique em Run

### ❌ "new row violates row-level security policy"

**Causa**: Políticas de segurança bloqueando

**Solução**:
1. No Supabase, vá em **Authentication** > **Policies**
2. Verifique se as políticas foram criadas
3. Se necessário, execute o script SQL novamente

### ❌ Site funciona local mas não na Vercel

**Causa**: Variáveis de ambiente não configuradas na Vercel

**Solução**:
1. Vá em **Settings** > **Environment Variables** na Vercel
2. Adicione as mesmas variáveis do `.env`
3. Faça novo deploy

### ❌ "Module not found: Can't resolve '@supabase/supabase-js'"

**Causa**: Dependência não instalada

**Solução**:
```bash
npm install @supabase/supabase-js
```

---

## 📞 PRECISA DE AJUDA?

### Links úteis:
- Documentação Supabase: https://supabase.com/docs
- Dashboard Supabase: https://supabase.com/dashboard/
- Suporte Supabase: https://supabase.com/support

### Comunidade:
- Discord Supabase: https://discord.supabase.com
- GitHub Issues: https://github.com/supabase/supabase/issues

---

## ✅ CHECKLIST FINAL

Depois de tudo, verifique:

- [ ] Conta Supabase criada
- [ ] Project URL copiado
- [ ] anon public key copiado
- [ ] SQL executado (4 tabelas criadas)
- [ ] Arquivo `.env` criado com as credenciais
- [ ] Site funcionando localmente
- [ ] Deploy realizado na Vercel
- [ ] Site funcionando online

---

**Se você seguiu todos os passos e ainda tem problemas, me avise qual passo deu errado que eu te ajudo!** 💪
