-- Create meeting sessions table
CREATE TABLE public.meeting_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL DEFAULT 'Untitled Meeting',
  duration_seconds INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'recording', 'transcribing', 'complete')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create transcripts table
CREATE TABLE public.meeting_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.meeting_sessions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create generated prompts table
CREATE TABLE public.meeting_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.meeting_sessions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.meeting_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_prompts ENABLE ROW LEVEL SECURITY;

-- RLS policies for meeting_sessions (public access for testing)
CREATE POLICY "Anyone can view sessions" ON public.meeting_sessions FOR SELECT USING (true);
CREATE POLICY "Anyone can create sessions" ON public.meeting_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update sessions" ON public.meeting_sessions FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete sessions" ON public.meeting_sessions FOR DELETE USING (true);

-- RLS policies for meeting_transcripts
CREATE POLICY "Anyone can view transcripts" ON public.meeting_transcripts FOR SELECT USING (true);
CREATE POLICY "Anyone can create transcripts" ON public.meeting_transcripts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update transcripts" ON public.meeting_transcripts FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete transcripts" ON public.meeting_transcripts FOR DELETE USING (true);

-- RLS policies for meeting_prompts
CREATE POLICY "Anyone can view prompts" ON public.meeting_prompts FOR SELECT USING (true);
CREATE POLICY "Anyone can create prompts" ON public.meeting_prompts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update prompts" ON public.meeting_prompts FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete prompts" ON public.meeting_prompts FOR DELETE USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_meeting_sessions_updated_at
  BEFORE UPDATE ON public.meeting_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meeting_prompts_updated_at
  BEFORE UPDATE ON public.meeting_prompts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.meeting_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.meeting_prompts;