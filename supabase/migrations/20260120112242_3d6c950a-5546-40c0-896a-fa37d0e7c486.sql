-- Create table for honeypot interaction logs
CREATE TABLE public.honeypot_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT,
  ip_hint TEXT,
  interaction_type TEXT NOT NULL,
  attempted_username TEXT,
  attempted_password TEXT,
  user_agent TEXT,
  referrer TEXT,
  page_path TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.honeypot_logs ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (honeypot needs to log anonymous attempts)
CREATE POLICY "Anyone can insert honeypot logs"
ON public.honeypot_logs
FOR INSERT
WITH CHECK (true);

-- Only admins can view logs
CREATE POLICY "Admins can view honeypot logs"
ON public.honeypot_logs
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));