# ⚡ GUIA RÁPIDO: SUPABASE + DEPLOY (5 MINUTOS)

## 🎯 EM 5 PASSOS SIMPLES:

### 1️⃣ CRIAR CONTA NO SUPABASE (1 min)
- Acesse: https://supabase.com
- Clique em **"Sign Up"** (use GitHub)
- Clique em **"New Project"**
- Nome: `diario-rubro-negro`
- Senha: (crie e GUARDE!)
- Region: Brazil
- Clique em **"Create new project"**

### 2️⃣ COPIAR CREDENCIAIS (30 seg)
- Vá em **Settings** > **API**
- Copie:
  - **Project URL**: `https://xxxxx.supabase.co`
  - **anon public key**: `eyJhbGc...`

### 3️⃣ CRIAR TABELAS (1 min)
- Vá em **SQL Editor**
- Clique em **"New query"**
- Copie TODO o conteúdo de `supabase-schema.sql`
- Cole e clique em **"Run"**
- Aguarde ~5 segundos

### 4️⃣ CONFIGURAR VARIÁVEIS (30 seg)
- Na raiz do projeto, crie arquivo `.env`:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### 5️⃣ DEPLOY NA VERCEL (2 min)
- Acesse: https://vercel.com
- Importe seu repositório do GitHub
- Adicione as variáveis de ambiente:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Clique em **"Deploy"**
- Pronto! 🎉

---

## 📋 COMANDOS RÁPIDOS:

```bash
# 1. Instalar dependências
npm install

# 2. Testar localmente
npm run dev

# 3. Build para produção
npm run build

# 4. Deploy (se usar Vercel CLI)
vercel --prod
```

---

## 🔗 LINKS IMPORTANTES:

- **Supabase**: https://supabase.com
- **Vercel**: https://vercel.com
- **Netlify**: https://netlify.com
- **Documentação completa**: `GUIA_DEPLOY_SUPABASE.md`

---

## ✅ CHECKLIST RÁPIDO:

- [ ] Conta Supabase criada
- [ ] Projeto criado no Supabase
- [ ] SQL executado (tabelas criadas)
- [ ] Arquivo `.env` configurado
- [ ] Código no GitHub
- [ ] Deploy realizado
- [ ] Site online!

---

## 🆘 PROBLEMAS?

### Erro de conexão?
- Verifique se as variáveis estão corretas no `.env`
- Confirme que o SQL foi executado
- Veja o console do navegador (F12)

### Site não funciona após deploy?
- Verifique as variáveis de ambiente na Vercel/Netlify
- Confirme que o build foi bem-sucedido
- Veja os logs de deploy

---

**Pronto! Seu site está no ar em 5 minutos!** 🚀

Para mais detalhes, veja: `GUIA_DEPLOY_SUPABASE.md`
