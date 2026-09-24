// Reformulador editorial de notícias
// Altera a redação e a estrutura sem substituir nomes próprios nem acrescentar fatos.

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

// Apenas termos genéricos podem variar. Nomes próprios como Flamengo,
// Maracanã, jogadores, técnicos e competições são preservados.
const crowdSynonyms = [
  'torcida', 'torcedores', 'Nação Rubro-Negra', 'rubro-negros'
];

const coachSynonyms = [
  'técnico', 'treinador', 'comissão técnica', 'comando técnico'
];

const matchSynonyms = [
  'partida', 'jogo', 'confronto', 'duelo', 'compromisso'
];

const victorySynonyms = [
  'vitória', 'triunfo', 'resultado positivo'
];

const defeatSynonyms = [
  'derrota', 'revés', 'resultado negativo'
];

const goalSynonyms = [
  'gol', 'marcação', 'bola na rede'
];

const playerSynonyms = [
  'jogador', 'atleta', 'integrante do elenco'
];

const trainingSynonyms = [
  'treino', 'atividade', 'trabalho', 'preparação', 'treinamento'
];

const championshipSynonyms = [
  'campeonato', 'competição', 'torneio'
];

const transferSynonyms = [
  'transferência', 'negociação', 'movimentação no mercado'
];

const connectors = [
  'Além disso,',
  'Também,',
  'Ao mesmo tempo,',
  'Nesse contexto,',
  'Por outro lado,',
  'Na sequência,',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function replaceWithSynonym(text: string, regex: RegExp, synonyms: string[]): string {
  return text.replace(regex, () => pick(synonyms));
}

function normalizeFlamengo(text: string): string {
  return text.replace(/\bflamengo\b/gi, 'Flamengo');
}

function cleanText(text: string): string {
  return normalizeFlamengo(
    text
      .replace(/\s+/g, ' ')
      .replace(/\s+([,.;!?])/g, '$1')
      .trim()
  );
}

// ============ REESCRITA DE TÍTULO ============

function rewriteTitle(title: string): string {
  let result = cleanText(title);

  // Flamengo e outros nomes próprios não são alterados.
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

  // Quando existe uma divisão natural, variar a estrutura sem alterar os fatos.
  if (result.includes(' - ')) {
    const parts = result.split(' - ').map(part => part.trim()).filter(Boolean);
    if (parts.length === 2 && Math.random() > 0.5) {
      result = `${parts[1]}: ${parts[0]}`;
    }
  }

  if (result.includes(':')) {
    const [lead, ...rest] = result.split(':');
    const tail = rest.join(':').trim();
    if (tail && Math.random() > 0.65) {
      result = `${tail} — ${lead.trim()}`;
    }
  }

  result = cleanText(result);
  return result.charAt(0).toUpperCase() + result.slice(1);
}

// ============ REESCRITA DE PARÁGRAFOS ============

function rewriteParagraph(paragraph: string): string {
  if (paragraph.trim().length < 10) return cleanText(paragraph);

  let result = cleanText(paragraph);

  // Variar apenas vocabulário genérico. Entidades e nomes próprios permanecem intactos.
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

  const sentences = result.split(/(?<=[.!?])\s+/).filter(Boolean);
  const rewritten = sentences.map((sentence, index) => {
    const cleaned = cleanText(sentence);
    if (index === 0 || cleaned.length < 25 || Math.random() <= 0.55) return cleaned;
    return `${pick(connectors)} ${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)}`;
  });

  return normalizeFlamengo(rewritten.join(' '));
}

// ============ REESCRITA DE CONTEÚDO COMPLETO ============

function rewriteContent(content: string): string {
  const paragraphs = content
    .split(/\n\n+/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return cleanText(content);

  // Não adiciona abertura, conclusão, opinião ou informação que não exista no original.
  return paragraphs.map(rewriteParagraph).join('\n\n');
}

// ============ GERAÇÃO DE RESUMO ============

function generateExcerpt(content: string, title: string): string {
  const firstSentences = content
    .split(/(?<=[.!?])\s+/)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 20)
    .slice(0, 2);

  if (firstSentences.length > 0) {
    let excerpt = rewriteParagraph(firstSentences.join(' '));
    if (excerpt.length > 200) excerpt = `${excerpt.substring(0, 197).trim()}...`;
    return normalizeFlamengo(excerpt);
  }

  return `${normalizeFlamengo(title)}. Confira os detalhes da matéria.`;
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
    const score = keywords.filter(keyword => lowerText.includes(keyword)).length;
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
    { keywords: ['flamengo'], tag: 'Flamengo' },
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
    if (keywords.some(keyword => lowerText.includes(keyword))) tags.push(tag);
  }

  return tags.slice(0, 4);
}

// ============ FUNÇÃO PRINCIPAL ============

export function reformulateNews(source: NewsSource): ReformulatedNews {
  const reformulatedTitle = rewriteTitle(source.originalTitle);
  const reformulatedContent = rewriteContent(source.originalContent);
  const reformulatedExcerpt = generateExcerpt(reformulatedContent, reformulatedTitle);
  const category = detectCategory(`${source.originalTitle} ${source.originalContent}`);
  const tags = extractTags(`${source.originalTitle} ${source.originalContent}`);

  return {
    title: normalizeFlamengo(reformulatedTitle),
    excerpt: normalizeFlamengo(reformulatedExcerpt),
    content: normalizeFlamengo(reformulatedContent),
    category,
    tags,
  };
}

export function batchReformulate(sources: NewsSource[]): ReformulatedNews[] {
  return sources.map(reformulateNews);
}
