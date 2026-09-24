# 🏗️ Arquitetura do Sistema - Diário Rubro-Negro

## 📁 Estrutura de Arquivos

```
src/
├── components/
│   ├── AdminPanel.tsx          # Painel administrativo completo
│   └── NewsImporter.tsx        # Importador de notícias reais
├── data/
│   └── draftNews.ts            # Estrutura de dados das notícias
├── utils/
│   └── newsReformulator.ts     # Motor de reformulação automática
├── App.tsx                     # Componente principal com todas as páginas
└── main.tsx                    # Entry point
```

## 🎯 Componentes Principais

### 1. App.tsx
**Responsabilidade:** Renderizar todas as páginas do site
- Home page com notícias
- Fórum da Nação
- Integração com painel admin
- Seção de notícias publicadas

**Estado gerenciado:**
- `activePage`: 'home' | 'forum'
- `showAdmin`: boolean
- `publishedNews`: NewsDraft[]
- `pendingCount`: number

### 2. AdminPanel.tsx
**Responsabilidade:** Gerenciar todo o fluxo de notícias
- Listar notícias por status (pendente, aprovada, rejeitada, publicada)
- Aprovar/rejeitar notícias
- Publicar no site
- Editar notícias
- Abrir importador de notícias reais

**Sub-componentes:**
- `NewsCard`: Card de notícia na lista
- `NewsDetail`: Visualização completa da notícia
- `NewsEditForm`: Formulário de edição
- `NewsCreateForm`: Formulário de criação manual

### 3. NewsImporter.tsx
**Responsabilidade:** Importar e reformular notícias reais
- Interface em 2 etapas (input → preview)
- Integração com reformulador
- Preview de imagens
- Edição antes de importar

**Estados:**
- `step`: 'input' | 'preview'
- `originalTitle`, `originalContent`: texto original
- `reformulated`: resultado da reformulação
- `edited*`: campos editáveis pelo usuário

## 🔧 Motor de Reformulação

### newsReformulator.ts

**Função principal:** `reformulateNews(source: NewsSource): ReformulatedNews`

#### Técnicas utilizadas:

##### 1. Substituição de Sinônimos
```typescript
const teamSynonyms = [
  'Flamengo', 'Rubro-Negro carioca', 'time da Gávea', 
  'Mais Querido', 'Clube carioca', 'equipe rubro-negra'
];
```

**Como funciona:**
- Regex identifica termos no texto
- Substitui por sinônimo aleatório
- Mantém contexto e gramática

##### 2. Reestruturação de Frases
```typescript
const connectors = [
  'Além disso,', 'Vale destacar que', 'Ademais,',
  'Outro ponto relevante é que', 'Cabe ressaltar que'
];
```

**Como funciona:**
- Divide texto em sentenças
- Adiciona conectivos variados
- Inverte orações quando possível

##### 3. Variação de Estilo
```typescript
const openers = [
  'Em mais uma atuação de destaque,',
  'Na tarde/noite deste',
  'Com uma atuação convincente,'
];
```

**Como funciona:**
- Diferentes aberturas para parágrafos
- Fechamentos variados
- Tom jornalístico mantido

##### 4. Detecção Inteligente
```typescript
function detectCategory(text: string): string {
  const categoryMap = [
    { keywords: ['gol', 'jogo', 'vitória'], category: 'Jogos' },
    { keywords: ['contrato', 'transferência'], category: 'Mercado' },
    // ...
  ];
}
```

**Como funciona:**
- Analisa palavras-chave no texto
- Conta ocorrências por categoria
- Retorna categoria com maior score

##### 5. Extração de Tags
```typescript
function extractTags(text: string): string[] {
  const tagMap = [
    { keywords: ['brasileirão'], tag: 'Brasileirão' },
    { keywords: ['arrascaeta'], tag: 'Arrascaeta' },
    // ...
  ];
}
```

**Como funciona:**
- Busca termos específicos (jogadores, competições)
- Retorna até 4 tags relevantes
- Facilita organização e busca

## 💾 Persistência de Dados

### localStorage

**Chaves utilizadas:**
- `drn_news`: Array de todas as notícias

**Estrutura de NewsDraft:**
```typescript
interface NewsDraft {
  id: string;                    // ID único
  title: string;                 // Título
  excerpt: string;               // Resumo
  content: string;               // Conteúdo completo
  category: string;              // Categoria
  author: string;                // Autor
  image: string;                 // URL da imagem
  tags: string[];                // Tags
  status: 'pending' | 'approved' | 'rejected' | 'published';
  createdAt: string;             // Data de criação
  reviewedAt?: string;           // Data de revisão
  reviewedBy?: string;           // Quem revisou
}
```

**Quando salva:**
- Ao aprovar/rejeitar
- Ao publicar
- Ao editar
- Ao importar nova notícia

**Quando carrega:**
- Ao abrir o painel admin
- Ao carregar a home page

## 🎨 Fluxo de Dados

### Fluxo de Importação:
```
1. Usuário cola notícia real
   ↓
2. NewsImporter recebe texto
   ↓
3. newsReformulator processa
   ↓
4. Usuário revisa resultado
   ↓
5. AdminPanel recebe NewsDraft
   ↓
6. Salva no localStorage
   ↓
7. Aparece na aba "Pendentes"
```

### Fluxo de Publicação:
```
1. Usuário clica "Aprovar"
   ↓
2. Status muda para 'approved'
   ↓
3. Usuário clica "Publicar"
   ↓
4. Status muda para 'published'
   ↓
5. App.tsx recebe via onPublish
   ↓
6. Atualiza publishedNews
   ↓
7. Aparece na home page
```

## 🔒 Segurança e Validação

### Validações implementadas:
- Campos obrigatórios (título, conteúdo)
- URLs de imagem válidas
- Limite de tamanho para resumos
- Tags limitadas a 4 itens

### Boas práticas:
- Sanitização de inputs
- Validação de URLs
- Tratamento de erros
- Feedback visual para usuário

## 📊 Métricas e Estatísticas

**Dados exibidos no painel:**
- Total de notícias
- Contagem por status
- Data da última atualização
- Número de publicações

**Onde aparecem:**
- Abas do painel (contadores)
- Rodapé do painel (estatísticas)
- Home page (badge de novas matérias)

## 🚀 Performance

### Otimizações:
- Lazy loading de imagens
- Componentes modulares
- Estado gerenciado eficientemente
- localStorage para persistência rápida

### Bundle size:
- CSS: ~45KB (gzip: ~7.6KB)
- JS: ~228KB (gzip: ~63KB)
- Total otimizado para carregamento rápido

## 🎯 Próximas Melhorias (Sugestões)

### Funcionalidades futuras:
- [ ] Upload de imagens (em vez de URL)
- [ ] Agendamento de publicações
- [ ] Múltiplos autores/editores
- [ ] Sistema de comentários
- [ ] Analytics de visualização
- [ ] Exportar notícias (PDF, JSON)
- [ ] Integração com APIs de notícias
- [ ] Sistema de categorias customizáveis
- [ ] Histórico de edições
- [ ] Backup automático

### Melhorias técnicas:
- [ ] Migrar para banco de dados real (Firebase, Supabase)
- [ ] Implementar autenticação
- [ ] API REST para integração
- [ ] Testes automatizados
- [ ] PWA (Progressive Web App)
- [ ] Cache inteligente
- [ ] CDN para imagens

---

**Desenvolvido com React + TypeScript + Tailwind CSS**

Sistema completo e funcional para gerenciamento de notícias esportivas!
