-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- Create intelligence_documents table for RAG
CREATE TABLE public.intelligence_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'briefing', -- briefing, policy, research, news
  entity TEXT DEFAULT 'general', -- For multi-domain routing
  authority TEXT DEFAULT 'informational', -- binding, official, informational
  processed_text TEXT,
  raw_content TEXT,
  source_url TEXT,
  source_name TEXT,
  document_date DATE DEFAULT CURRENT_DATE,
  embedding vector(1536), -- OpenAI text-embedding-3-small dimension
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.intelligence_documents ENABLE ROW LEVEL SECURITY;

-- RLS: Anyone can read documents (for briefing grounding)
CREATE POLICY "Anyone can read intelligence documents"
ON public.intelligence_documents
FOR SELECT
USING (true);

-- RLS: Only admins can manage documents
CREATE POLICY "Admins can manage intelligence documents"
ON public.intelligence_documents
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create semantic search function with cosine similarity
CREATE OR REPLACE FUNCTION public.search_documents(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5,
  filter_entity text DEFAULT NULL,
  filter_type text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  title text,
  processed_text text,
  document_date date,
  entity text,
  authority text,
  source_name text,
  source_url text,
  similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.title,
    d.processed_text,
    d.document_date,
    d.entity,
    d.authority,
    d.source_name,
    d.source_url,
    1 - (d.embedding <=> query_embedding) AS similarity
  FROM intelligence_documents d
  WHERE d.embedding IS NOT NULL
    AND d.processed_text IS NOT NULL
    AND 1 - (d.embedding <=> query_embedding) > match_threshold
    AND (filter_entity IS NULL OR d.entity = filter_entity OR d.entity = 'general')
    AND (filter_type IS NULL OR d.content_type = filter_type)
  ORDER BY d.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create index for vector similarity search
CREATE INDEX idx_intelligence_documents_embedding 
ON public.intelligence_documents 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create index for filtering
CREATE INDEX idx_intelligence_documents_entity ON public.intelligence_documents(entity);
CREATE INDEX idx_intelligence_documents_type ON public.intelligence_documents(content_type);

-- Trigger for updated_at
CREATE TRIGGER update_intelligence_documents_updated_at
BEFORE UPDATE ON public.intelligence_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();