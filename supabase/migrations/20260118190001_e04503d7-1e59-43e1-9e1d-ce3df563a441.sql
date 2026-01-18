-- Create visa applications table
CREATE TABLE public.visa_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  application_date DATE,
  current_phase TEXT DEFAULT 'preparation',
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create visa documents table
CREATE TABLE public.visa_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.visa_applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  due_date DATE,
  submitted_date DATE,
  notes TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create visa interviews table
CREATE TABLE public.visa_interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.visa_applications(id) ON DELETE CASCADE,
  scheduled_date TIMESTAMPTZ,
  interview_type TEXT DEFAULT 'monthly',
  location TEXT DEFAULT 'Shibuya Ward Office',
  status TEXT DEFAULT 'scheduled',
  agenda TEXT,
  notes TEXT,
  outcome TEXT,
  next_actions TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create visa milestones table
CREATE TABLE public.visa_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.visa_applications(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL,
  title TEXT NOT NULL,
  target_date DATE,
  completed_date DATE,
  status TEXT DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.visa_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visa_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visa_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visa_milestones ENABLE ROW LEVEL SECURITY;

-- RLS Policies for visa_applications
CREATE POLICY "Users can view own applications"
ON public.visa_applications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own applications"
ON public.visa_applications FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
ON public.visa_applications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications"
ON public.visa_applications FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for visa_documents
CREATE POLICY "Users can view own documents"
ON public.visa_documents FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.visa_applications
  WHERE id = visa_documents.application_id
  AND user_id = auth.uid()
));

CREATE POLICY "Users can create own documents"
ON public.visa_documents FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.visa_applications
  WHERE id = visa_documents.application_id
  AND user_id = auth.uid()
));

CREATE POLICY "Users can update own documents"
ON public.visa_documents FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.visa_applications
  WHERE id = visa_documents.application_id
  AND user_id = auth.uid()
));

CREATE POLICY "Users can delete own documents"
ON public.visa_documents FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.visa_applications
  WHERE id = visa_documents.application_id
  AND user_id = auth.uid()
));

-- RLS Policies for visa_interviews
CREATE POLICY "Users can view own interviews"
ON public.visa_interviews FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.visa_applications
  WHERE id = visa_interviews.application_id
  AND user_id = auth.uid()
));

CREATE POLICY "Users can create own interviews"
ON public.visa_interviews FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.visa_applications
  WHERE id = visa_interviews.application_id
  AND user_id = auth.uid()
));

CREATE POLICY "Users can update own interviews"
ON public.visa_interviews FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.visa_applications
  WHERE id = visa_interviews.application_id
  AND user_id = auth.uid()
));

CREATE POLICY "Users can delete own interviews"
ON public.visa_interviews FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.visa_applications
  WHERE id = visa_interviews.application_id
  AND user_id = auth.uid()
));

-- RLS Policies for visa_milestones
CREATE POLICY "Users can view own milestones"
ON public.visa_milestones FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.visa_applications
  WHERE id = visa_milestones.application_id
  AND user_id = auth.uid()
));

CREATE POLICY "Users can create own milestones"
ON public.visa_milestones FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.visa_applications
  WHERE id = visa_milestones.application_id
  AND user_id = auth.uid()
));

CREATE POLICY "Users can update own milestones"
ON public.visa_milestones FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.visa_applications
  WHERE id = visa_milestones.application_id
  AND user_id = auth.uid()
));

CREATE POLICY "Users can delete own milestones"
ON public.visa_milestones FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.visa_applications
  WHERE id = visa_milestones.application_id
  AND user_id = auth.uid()
));

-- Create updated_at trigger for visa_applications
CREATE TRIGGER update_visa_applications_updated_at
BEFORE UPDATE ON public.visa_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();