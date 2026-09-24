# 🔴⚫ Diário Rubro-Negro

Site de notícias do Flamengo com sistema automático de busca e reformulação de notícias reais.

## 🚀 Funcionalidades

### ✅ Sistema de Notícias
- **Busca automática** em 9 fontes (GE, ESPN, UOL, Lance!, Goal, Terra, O Dia, Coluna do Fla, Google News)
- **Reformulação automática** para parecer conteúdo original
- **Painel administrativo** completo para aprovação
- **Persistência** em localStorage ou Supabase

### ✅ Fórum da Nação
- Discussões em tempo real
- Sistema de categorias
- Tópicos fixos e hot
- Ranking de membros

### ✅ Interface Moderna
- Design responsivo
- Tema rubro-negro
- Animações suaves
- Navegação intuitiva

## 📦 Instalação

```bash
# Clonar repositório
git clone https://github.com/SEU-USUARIO/diario-rubro-negro.git

# Entrar na pasta
cd diario-rubro-negro

# Instalar dependências
npm install

# Executar localmente
npm run dev
```

## 🔧 Configuração

### Opção 1: localStorage (Simples)
- Funciona imediatamente
- Dados salvos no navegador
- Ideal para testes

### Opção 2: Supabase (Recomendado)
- Banco de dados real
- Sincronização em tempo real
- Pronto para produção

Veja: [GUIA_DEPLOY_SUPABASE.md](./GUIA_DEPLOY_SUPABASE.md)

## 📚 Documentação

### Guias Principais
- [QUICK_START.md](./QUICK_START.md) - Comece em 5 minutos
- [GUIA_DEPLOY_SUPABASE.md](./GUIA_DEPLOY_SUPABASE.md) - Deploy completo com Supabase
- [GUIA_RAPIDO_AUTO.md](./GUIA_RAPIDO_AUTO.md) - Sistema automático de notícias
- [README_AUTOMATICO.md](./README_AUTOMATICO.md) - Detalhes do sistema automático
- [ARQUITETURA.md](./ARQUITETURA.md) - Arquitetura técnica

### Como Usar

#### Sistema Automático de Notícias
1. Clique na engrenagem ⚙️ no topo do site
2. Clique em **"Buscar Notícias Automático"**
3. Selecione as notícias que quer
4. Clique em **"Importar Selecionadas"**
5. Aprove e publique!

#### Importar Manualmente
1. Copie uma notícia de outro site
2. Cole no importador
3. O sistema reformula automaticamente
4. Revise e publique

## 🛠️ Tecnologias

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Supabase** - Backend (opcional)
- **RSS2JSON** - Busca de notícias
- **Font Awesome** - Ícones

## 📊 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── AdminPanel.tsx   # Painel administrativo
│   ├── AutoNewsFetcher.tsx  # Busca automática
│   └── NewsImporter.tsx # Importador manual
├── services/           # Serviços
│   └── newsFetcher.ts  # Busca de notícias
├── utils/             # Utilitários
│   └── newsReformulator.ts  # Reformulação
├── lib/               # Bibliotecas
│   └── supabase.ts    # Integração Supabase
└── App.tsx           # Componente principal
```

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build
npm run build

# Deploy manual
# Arraste a pasta 'dist' para Netlify
```

### GitHub Pages
```bash
npm run deploy
```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```

Veja `.env.example` para referência.

## 📱 Fontes de Notícias

O sistema busca automaticamente em:

1. 🟢 GE Globo - Flamengo
2. 🔴 ESPN Brasil
3. 🟡 UOL Esporte
4. ⚪ Lance!
5. 🔵 Goal Brasil
6. 🟠 Terra Esportes
7. 🟣 O Dia - Flamengo
8. ⚫ Coluna do Fla
9. 🔍 Google News

## 🎯 Próximas Funcionalidades

- [ ] Upload de imagens
- [ ] Sistema de comentários
- [ ] Newsletter automática
- [ ] Notificações push
- [ ] App mobile (PWA)
- [ ] Analytics integrado
- [ ] Multi-idioma

## 🤝 Contribuindo

Contribuições são bem-vindas!

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 📞 Contato

- **Email**: contato@diariorubronegro.com.br
- **Instagram**: @diariorubronegro
- **Twitter**: @diariorubronegro

## 🙏 Agradecimentos

- Comunidade Rubro-Negra
- Contribuidores open source
- Todos os torcedores do Flamengo

---

**Feito com ❤️ pela Nação Rubro-Negra** 🔴⚫

**SRGB! Somos Nós a Jovem Guarda!**
