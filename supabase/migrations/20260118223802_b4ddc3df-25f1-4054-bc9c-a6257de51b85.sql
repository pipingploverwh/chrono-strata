-- Create investor_contacts table for storing investor inquiries
CREATE TABLE public.investor_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  firm TEXT,
  investment_interest TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.investor_contacts ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for form submissions)
CREATE POLICY "Anyone can submit investor inquiries"
ON public.investor_contacts FOR INSERT
WITH CHECK (true);

-- Only admins can read/update/delete
CREATE POLICY "Admins can view investor contacts"
ON public.investor_contacts FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update investor contacts"
ON public.investor_contacts FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete investor contacts"
ON public.investor_contacts FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Updated_at trigger
CREATE TRIGGER update_investor_contacts_updated_at
  BEFORE UPDATE ON public.investor_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();