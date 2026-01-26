import { supabase } from '@/integrations/supabase/client';

export interface RagDocument {
  id: string;
  title: string;
  processed_text: string;
  document_date: string;
  entity: string;
  authority: string;
  source_name: string;
  source_url: string;
  similarity: number;
}

export interface EmbeddingResult {
  success: boolean;
  embedding?: number[];
  dimensions?: number;
  documentId?: string;
  stored?: boolean;
  error?: string;
}

export interface SearchResult {
  success: boolean;
  documents: RagDocument[];
  query?: string;
  matchCount?: number;
  error?: string;
}

/**
 * Generate embeddings for text content
 * @param text - The text to generate embeddings for
 * @param metadata - Optional metadata for storing the document
 * @param storeInDb - Whether to store the document in the database
 */
export async function generateEmbedding(
  text: string,
  metadata?: {
    title?: string;
    contentType?: string;
    entity?: string;
    authority?: string;
    sourceUrl?: string;
    sourceName?: string;
  },
  storeInDb = false
): Promise<EmbeddingResult> {
  const { data, error } = await supabase.functions.invoke('generate-embeddings', {
    body: { text, metadata, storeInDb },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return data;
}

/**
 * Search documents using semantic similarity
 * @param query - The search query
 * @param options - Search options
 */
export async function searchDocuments(
  query: string,
  options?: {
    matchThreshold?: number;
    matchCount?: number;
    filterEntity?: string;
    filterType?: string;
  }
): Promise<SearchResult> {
  const { data, error } = await supabase.functions.invoke('rag-search', {
    body: {
      query,
      matchThreshold: options?.matchThreshold ?? 0.5,
      matchCount: options?.matchCount ?? 5,
      filterEntity: options?.filterEntity,
      filterType: options?.filterType,
    },
  });

  if (error) {
    return { success: false, documents: [], error: error.message };
  }

  return data;
}

/**
 * Index a document for RAG retrieval
 * @param document - Document to index
 */
export async function indexDocument(document: {
  text: string;
  title: string;
  contentType?: string;
  entity?: string;
  authority?: string;
  sourceUrl?: string;
  sourceName?: string;
}): Promise<EmbeddingResult> {
  return generateEmbedding(
    document.text,
    {
      title: document.title,
      contentType: document.contentType || 'briefing',
      entity: document.entity || 'general',
      authority: document.authority || 'informational',
      sourceUrl: document.sourceUrl,
      sourceName: document.sourceName,
    },
    true // Store in database
  );
}

/**
 * Build context string from retrieved documents for LLM prompts
 * @param documents - Array of retrieved documents
 * @param maxChars - Maximum characters per document
 */
export function buildRagContext(documents: RagDocument[], maxChars = 2000): string {
  if (documents.length === 0) return '';

  return documents
    .map((doc, i) => `
[Document ${i + 1}] (${(doc.similarity * 100).toFixed(1)}% relevant)
Title: ${doc.title}
Date: ${doc.document_date}
Authority: ${doc.authority}
${doc.processed_text?.slice(0, maxChars) || 'No content'}
---`)
    .join('\n');
}
