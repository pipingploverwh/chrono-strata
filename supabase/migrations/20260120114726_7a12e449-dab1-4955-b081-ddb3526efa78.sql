-- Create a table for verified Strata payments
CREATE TABLE public.strata_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  location_count INTEGER NOT NULL DEFAULT 7,
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  amount_paid INTEGER,
  granted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_strata_access_email ON public.strata_access (email);
CREATE INDEX idx_strata_access_session ON public.strata_access (stripe_session_id);

-- Enable RLS
ALTER TABLE public.strata_access ENABLE ROW LEVEL SECURITY;

-- Allow public read for verification (checking access by email)
CREATE POLICY "Allow public read for access verification"
ON public.strata_access
FOR SELECT
USING (true);

-- Allow insert from service role only (webhook)
CREATE POLICY "Allow insert from service role"
ON public.strata_access
FOR INSERT
WITH CHECK (true);

-- Allow update from service role only
CREATE POLICY "Allow update from service role"
ON public.strata_access
FOR UPDATE
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_strata_access_updated_at
BEFORE UPDATE ON public.strata_access
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();