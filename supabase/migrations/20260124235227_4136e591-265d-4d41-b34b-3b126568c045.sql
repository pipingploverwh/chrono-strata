-- Create bookmarked_briefings table for saving favorite cards
CREATE TABLE public.bookmarked_briefings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  card_id TEXT NOT NULL,
  card_data JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id, card_id)
);

-- Enable RLS
ALTER TABLE public.bookmarked_briefings ENABLE ROW LEVEL SECURITY;

-- Anyone can view bookmarks (for public demo mode)
CREATE POLICY "Anyone can view bookmarks"
  ON public.bookmarked_briefings FOR SELECT
  USING (true);

-- Anyone can create bookmarks  
CREATE POLICY "Anyone can create bookmarks"
  ON public.bookmarked_briefings FOR INSERT
  WITH CHECK (true);

-- Anyone can delete bookmarks
CREATE POLICY "Anyone can delete bookmarks"
  ON public.bookmarked_briefings FOR DELETE
  USING (true);

-- Create index for faster queries
CREATE INDEX idx_bookmarked_briefings_session ON public.bookmarked_briefings(session_id);
CREATE INDEX idx_bookmarked_briefings_created ON public.bookmarked_briefings(created_at DESC);