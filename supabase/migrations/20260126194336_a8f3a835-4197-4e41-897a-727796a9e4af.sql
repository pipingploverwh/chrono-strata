-- Sprint Dashboard Database Schema

-- Create enum for story status
CREATE TYPE public.story_status AS ENUM ('backlog', 'design', 'ready', 'in-progress', 'qa', 'done');

-- Create enum for story priority
CREATE TYPE public.story_priority AS ENUM ('ship', 'defer', 'descope');

-- Create enum for sprint phase
CREATE TYPE public.sprint_phase AS ENUM ('design', 'build', 'review');

-- Create enum for design thinking stage
CREATE TYPE public.design_thinking_stage AS ENUM ('empathize', 'define', 'ideate', 'prototype', 'test');

-- Sprints table
CREATE TABLE public.sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phase sprint_phase NOT NULL DEFAULT 'design',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  goals TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User stories table
CREATE TABLE public.user_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id UUID REFERENCES public.sprints(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  acceptance_criteria TEXT[] DEFAULT '{}',
  status story_status NOT NULL DEFAULT 'backlog',
  priority story_priority NOT NULL DEFAULT 'ship',
  points INTEGER NOT NULL DEFAULT 1,
  assignee TEXT,
  epic TEXT,
  tags TEXT[] DEFAULT '{}',
  design_thinking_stage design_thinking_stage,
  api_contract JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Burndown data table
CREATE TABLE public.burndown_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id UUID REFERENCES public.sprints(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  planned INTEGER NOT NULL,
  actual INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(sprint_id, date)
);

-- Enable RLS on all tables
ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.burndown_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sprints (admins can manage, anyone can view)
CREATE POLICY "Anyone can view sprints"
  ON public.sprints FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage sprints"
  ON public.sprints FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for user_stories (admins can manage, anyone can view)
CREATE POLICY "Anyone can view stories"
  ON public.user_stories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage stories"
  ON public.user_stories FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for burndown_data (admins can manage, anyone can view)
CREATE POLICY "Anyone can view burndown"
  ON public.burndown_data FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage burndown"
  ON public.burndown_data FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Create updated_at trigger for sprints
CREATE TRIGGER update_sprints_updated_at
  BEFORE UPDATE ON public.sprints
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create updated_at trigger for user_stories
CREATE TRIGGER update_user_stories_updated_at
  BEFORE UPDATE ON public.user_stories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_user_stories_sprint_id ON public.user_stories(sprint_id);
CREATE INDEX idx_user_stories_status ON public.user_stories(status);
CREATE INDEX idx_user_stories_priority ON public.user_stories(priority);
CREATE INDEX idx_burndown_data_sprint_id ON public.burndown_data(sprint_id);