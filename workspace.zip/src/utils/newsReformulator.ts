// Sistema avançado de reformulação de notícias
// Transforma notícias reais em conteúdo original

export interface NewsSource {
  originalTitle: string;
  originalContent: string;
  source: string;
}

export interface ReformulatedNews {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
}

// ============ BANCO DE SINÔNIMOS E EXPRESSÕES ============

const teamSynonyms = [
  'Flamengo', 'Rubro-Negro carioca', 'time da Gávea', 'Mais Querido',
  'Clube carioca', 'equipe rubro-negra', 'Fla', 'time da Nação',
  'Rubro-Negro', 'clube da Gávea', 'elenco carioca'
];

const stadiumSynonyms = [
  'Maracanã', 'templo do futebol brasileiro', 'Maraca', 'estádio',
  'casa do Flamengo', 'praça esportiva', 'gigante carioca'
];

const crowdSynonyms = [
  'torcida', 'Nação Rubro-Negra', 'fiel torcida', 'torcedores',
  'apoiadores', 'Nação', 'público presente', 'arquibancada'
];

const coachSynonyms = [
  'comissão técnica', 'técnico', 'treinador', 'comando técnico',
  'staff técnico', 'departamento de futebol'
];

const matchSynonyms = [
  'partida', 'jogo', 'confronto', 'embate', 'compromisso',
  'duelo', 'peleja', 'disputa', 'clássico'
];

const victorySynonyms = [
  'vitória', 'triunfo', 'resultado positivo', 'sucesso',
  'conquista', 'resultado favorável', 'sucesso em campo'
];

const defeatSynonyms = [
  'derrota', 'revés', 'resultado negativo', 'desfecho adverso',
  'tropéço', 'resultado desfavorável'
];

const goalSynonyms = [
  'gol', 'balão na rede', 'marcação', 'tentativa convertida',
  'conclusão certeira', 'finalização precisa'
];

const playerSynonyms = [
  'jogador', 'atleta', 'craque', 'profissional', 'camisa',
  'integrante do elenco', 'peça do time'
];

const trainingSynonyms = [
  'treino', 'atividade', 'trabalho', 'preparação', 'sessão',
  'prática', 'treinamento'
];

const championshipSynonyms = [
  'campeonato', 'competição', 'disputa', 'torneio', 'certame',
  'campanha', 'jornada'
];

const transferSynonyms = [
  'transferência', 'negociação', 'contratação', 'acordo',
  'negociação', 'movimentação no mercado'
];

// ============ CONECTIVOS E TRANSIÇÕES ============

const openers = [
  'Em mais uma atuação de destaque,',
  'Na tarde/noite deste',
  'Com uma atuação convincente,',
  'Demonstrando qualidade técnica,',
  'Sob os olhares da torcida,',
  'Em partida válida pela',
  'Pela rodada da',
  'Visando a sequência da temporada,',
  'Com foco na competição,',
  'Em dia inspirado,',
];

const connectors = [
  'Além disso,', 'Vale destacar que', 'É importante notar que',
  'Ademais,', 'Outro ponto relevante é que', 'Cabe ressaltar que',
  'Somado a isso,', 'Paralelamente,', 'Nesse sentido,',
  'Diante desse cenário,', 'Nessa perspectiva,', 'Sob essa ótica,',
];

const closers = [
  'O time agora se prepara para o próximo compromisso.',
  'A equipe segue focada na sequência da temporada.',
  'A Nação Rubro-Negra espera continuar vibrando com boas atuações.',
  'O foco agora se volta para os próximos desafios.',
  'A comissão técnica já projeta os próximos passos.',
  'A torcida segue confiante na sequência da campanha.',
];

// ============ FUNÇÕES AUXILIARES ============

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============ REESCRITA DE TÍTULO ============

function rewriteTitle(title: string): string {
  let result = title;
  
  // Substituir termos
  result = replaceWithSynonym(result, /\bflamengo\b/gi, teamSynonyms);
  result = replaceWithSynonym(result, /\bmaracan[ãa]\b/gi, stadiumSynonyms);
  result = replaceWithSynonym(result, /\btorcida\b/gi, crowdSynonyms);
  result = replaceWithSynonym(result, /\bjogo\b/gi, matchSynonyms);
  result = replaceWithSynonym(result, /\bpartida\b/gi, matchSynonyms);
  result = replaceWithSynonym(result, /\bvit[óo]ria\b/gi, victorySynonyms);
  result = replaceWithSynonym(result, /\bderrota\b/gi, defeatSynonyms);
  result = replaceWithSynonym(result, /\bgol\b/gi, goalSynonyms);
  result = replaceWithSynonym(result, /\bjogador\b/gi, playerSynonyms);
  result = replaceWithSynonym(result, /\bt[ée]cnico\b/gi, coachSynonyms);
  result = replaceWithSynonym(result, /\bcampeonato\b/gi, championshipSynonyms);
  result = replaceWithSynonym(result, /\btransfer[eê]ncia\b/gi, transferSynonyms);
  
  // Garantir que começa com maiúscula
  result = result.charAt(0).toUpperCase() + result.slice(1);
  
  // Adicionar variação de estilo
  const styles = [
    (t: string) => t,
    (t: string) => `${t.split(':')[0]}: ${t.split(':').slice(1).join(':') || t}`,
    (t: string) => {
      const parts = t.split(' - ');
      return parts.length > 1 ? `${parts[1].trim()} - ${parts[0].trim()}` : t;
    }
  ];
  
  return pick(styles)(result);
}

function replaceWithSynonym(text: string, regex: RegExp, synonyms: string[]): string {
  return text.replace(regex, () => pick(synonyms));
}

// ============ REESCRITA DE PARÁGRAFOS ============

function rewriteParagraph(paragraph: string): string {
  if (paragraph.trim().length < 10) return paragraph;
  
  let result = paragraph;
  
  // Substituir termos gerais
  result = replaceWithSynonym(result, /\bflamengo\b/gi, teamSynonyms);
  result = replaceWithSynonym(result, /\bFlamengo\b/g, teamSynonyms.map(s => s.charAt(0).toUpperCase() + s.slice(1)));
  result = replaceWithSynonym(result, /\bmaracan[ãa]\b/gi, stadiumSynonyms);
  result = replaceWithSynonym(result, /\btorcida\b/gi, crowdSynonyms);
  result = replaceWithSynonym(result, /\bt[ée]cnico\b/gi, coachSynonyms);
  result = replaceWithSynonym(result, /\bjogo\b/gi, matchSynonyms);
  result = replaceWithSynonym(result, /\bpartida\b/gi, matchSynonyms);
  result = replaceWithSynonym(result, /\bvit[óo]ria\b/gi, victorySynonyms);
  result = replaceWithSynonym(result, /\bderrota\b/gi, defeatSynonyms);
  result = replaceWithSynonym(result, /\bgol(?:s)?\b/gi, goalSynonyms);
  result = replaceWithSynonym(result, /\bjogador(?:es)?\b/gi, playerSynonyms);
  result = replaceWithSynonym(result, /\btreino\b/gi, trainingSynonyms);
  result = replaceWithSynonym(result, /\bcampeonato\b/gi, championshipSynonyms);
  result = replaceWithSynonym(result, /\btransfer[eê]ncia(?:s)?\b/gi, transferSynonyms);
  
  // Reestruturar frases - inverter orações quando possível
  const sentences = result.split(/(?<=[.!?])\s+/);
  const rewrittenSentences = sentences.map((sentence, idx) => {
    if (sentence.trim().length < 5) return sentence;
    
    // Adicionar conectivos variados
    if (idx > 0 && Math.random() > 0.6) {
      return `${pick(connectors)} ${sentence.charAt(0).toLowerCase()}${sentence.slice(1)}`;
    }
    
    return sentence;
  });
  
  return rewrittenSentences.join(' ');
}

// ============ REESCRITA DE CONTEÚDO COMPLETO ============

function rewriteContent(content: string): string {
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
  
  if (paragraphs.length === 0) return content;
  
  const rewrittenParagraphs = paragraphs.map((para, idx) => {
    let rewritten = rewriteParagraph(para);
    
    // Adicionar opener no primeiro parágrafo
    if (idx === 0 && Math.random() > 0.3) {
      rewritten = `${pick(openers)} ${rewritten.charAt(0).toLowerCase()}${rewritten.slice(1)}`;
    }
    
    return rewritten;
  });
  
  // Adicionar fechamento
  if (Math.random() > 0.4) {
    rewrittenParagraphs.push(pick(closers));
  }
  
  return rewrittenParagraphs.join('\n\n');
}

// ============ GERAÇÃO DE RESUMO ============

function generateExcerpt(content: string, title: string): string {
  // Pegar as primeiras frases do conteúdo
  const firstSentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20).slice(0, 2);
  
  if (firstSentences.length > 0) {
    let excerpt = firstSentences.join('. ').trim();
    excerpt = rewriteParagraph(excerpt);
    
    // Limitar tamanho
    if (excerpt.length > 200) {
      excerpt = excerpt.substring(0, 197) + '...';
    }
    
    return excerpt.charAt(0).toUpperCase() + excerpt.slice(1);
  }
  
  // Fallback: usar o título reformulado
  return `${title}. Confira os detalhes da matéria.`;
}

// ============ DETECÇÃO DE CATEGORIA ============

function detectCategory(text: string): string {
  const lowerText = text.toLowerCase();
  
  const categoryMap: { keywords: string[]; category: string }[] = [
    { keywords: ['gol', 'jogo', 'partida', 'vitória', 'derrota', 'empate', 'placar', 'resultado', 'escalação', 'estreia'], category: 'Jogos' },
    { keywords: ['contrato', 'transferência', 'negociação', 'contratação', 'reforço', 'mercado', 'acordo', 'salário', 'luvas'], category: 'Mercado' },
    { keywords: ['treino', 'treinamento', 'ct', 'ninho', 'atividade', 'preparação', 'comissão técnica'], category: 'Treino' },
    { keywords: ['libertadores', 'conmebol', 'sul-americana', 'copa'], category: 'Libertadores' },
    { keywords: ['base', 'jovem', 'sub-20', 'sub-17', 'categoria de base', 'promessa', 'revelação'], category: 'Base' },
    { keywords: ['análise', 'tática', 'esquema', 'sistema', 'formação', 'tático'], category: 'Análise' },
    { keywords: ['lesão', 'médico', 'departamento médico', 'recuperação', 'desconforto', 'exame', 'fisioterapia'], category: 'Departamento Médico' },
    { keywords: ['entrevista', 'declarou', 'afirmou', 'disse', 'falou', 'revelou', 'comentou', 'respondeu'], category: 'Entrevista' },
    { keywords: ['estatística', 'número', 'ranking', 'melhor', 'maior', 'recorde', 'marca', 'média'], category: 'Estatísticas' },
    { keywords: ['maracanã', 'estádio', 'gramado', 'reforma', 'obra', 'estrutura'], category: 'Maracanã' },
    { keywords: ['torcida', 'nação', 'organizada', 'festa', 'coreografia', 'ingressos'], category: 'Torcida' },
  ];
  
  let bestMatch = 'Destaque';
  let bestScore = 0;
  
  for (const { keywords, category } of categoryMap) {
    const score = keywords.filter(k => lowerText.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = category;
    }
  }
  
  return bestMatch;
}

// ============ EXTRAÇÃO DE TAGS ============

function extractTags(text: string): string[] {
  const tags: string[] = [];
  const lowerText = text.toLowerCase();
  
  const tagMap: { keywords: string[]; tag: string }[] = [
    { keywords: ['brasileirão', 'campeonato brasileiro', 'série a'], tag: 'Brasileirão' },
    { keywords: ['libertadores', 'conmebol'], tag: 'Libertadores' },
    { keywords: ['maracanã'], tag: 'Maracanã' },
    { keywords: ['arrascaeta'], tag: 'Arrascaeta' },
    { keywords: ['gabigol', 'gabriel barbos'], tag: 'Gabigol' },
    { keywords: ['pedro'], tag: 'Pedro' },
    { keywords: ['everton ribeiro'], tag: 'Everton Ribeiro' },
    { keywords: ['base', 'ninho'], tag: 'Base' },
    { keywords: ['transferência', 'contratação', 'reforço'], tag: 'Transferências' },
    { keywords: ['tática', 'esquema'], tag: 'Tática' },
    { keywords: ['copa do brasil'], tag: 'Copa do Brasil' },
    { keywords: ['mundial', 'interclubes'], tag: 'Mundial' },
  ];
  
  for (const { keywords, tag } of tagMap) {
    if (keywords.some(k => lowerText.includes(k))) {
      tags.push(tag);
    }
  }
  
  return tags.slice(0, 4);
}

// ============ FUNÇÃO PRINCIPAL ============

export function reformulateNews(source: NewsSource): ReformulatedNews {
  const reformulatedTitle = rewriteTitle(source.originalTitle);
  const reformulatedContent = rewriteContent(source.originalContent);
  const reformulatedExcerpt = generateExcerpt(source.originalContent, reformulatedTitle);
  const category = detectCategory(source.originalTitle + ' ' + source.originalContent);
  const tags = extractTags(source.originalTitle + ' ' + source.originalContent);
  
  return {
    title: reformulatedTitle,
    excerpt: reformulatedExcerpt,
    content: reformulatedContent,
    category: category,
    tags: tags
  };
}

// Processar múltiplas notícias
export function batchReformulate(sources: NewsSource[]): ReformulatedNews[] {
  return sources.map(reformulateNews);
}
