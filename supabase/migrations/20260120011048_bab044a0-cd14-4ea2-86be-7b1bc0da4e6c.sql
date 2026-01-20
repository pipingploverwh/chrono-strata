-- Create pilot_applications table for enterprise demand tracking
CREATE TABLE public.pilot_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  company_size TEXT NOT NULL,
  industry TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_title TEXT,
  use_case TEXT NOT NULL,
  use_case_details TEXT,
  desired_timeline TEXT NOT NULL,
  budget_range TEXT,
  current_solution TEXT,
  status TEXT DEFAULT 'new',
  priority TEXT DEFAULT 'medium',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pilot_applications ENABLE ROW LEVEL SECURITY;

-- Public can submit pilot applications
CREATE POLICY "Anyone can submit pilot applications"
  ON public.pilot_applications FOR INSERT
  WITH CHECK (true);

-- Admins can view all applications
CREATE POLICY "Admins can view pilot applications"
  ON public.pilot_applications FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update applications
CREATE POLICY "Admins can update pilot applications"
  ON public.pilot_applications FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete applications
CREATE POLICY "Admins can delete pilot applications"
  ON public.pilot_applications FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_pilot_applications_updated_at
  BEFORE UPDATE ON public.pilot_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();