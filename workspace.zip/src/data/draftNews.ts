// Notícias do sistema
// Inicialmente vazio - use o "Importar Notícia Real" no painel admin
// para adicionar notícias reais reformuladas automaticamente

export interface NewsDraft {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected' | 'published';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

// Array vazio - notícias serão adicionadas pelo importador
export const draftNews: NewsDraft[] = [];
