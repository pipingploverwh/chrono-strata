-- Create function to update timestamps if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create scheduled emails table
CREATE TABLE public.scheduled_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  email_type TEXT NOT NULL DEFAULT 'executive_summary',
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scheduled_emails ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert scheduled emails (public feature)
CREATE POLICY "Anyone can schedule emails"
ON public.scheduled_emails
FOR INSERT
WITH CHECK (true);

-- Allow reading pending emails for processing
CREATE POLICY "Anyone can read emails"
ON public.scheduled_emails
FOR SELECT
USING (true);

-- Allow updating email status
CREATE POLICY "Anyone can update emails"
ON public.scheduled_emails
FOR UPDATE
USING (true);

-- Create index for efficient querying of pending emails
CREATE INDEX idx_scheduled_emails_pending ON public.scheduled_emails (scheduled_at) 
WHERE status = 'pending';

-- Add trigger for updated_at
CREATE TRIGGER update_scheduled_emails_updated_at
BEFORE UPDATE ON public.scheduled_emails
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();