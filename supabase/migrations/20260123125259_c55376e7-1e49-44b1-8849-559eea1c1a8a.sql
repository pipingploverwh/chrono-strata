-- Create nesting_sites table for Piping Plover conservation tracking
CREATE TABLE public.nesting_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'fledged', 'abandoned')),
  eggs INTEGER DEFAULT 0,
  chicks INTEGER DEFAULT 0,
  threat_level TEXT DEFAULT 'low' CHECK (threat_level IN ('low', 'medium', 'high')),
  last_check TIMESTAMP WITH TIME ZONE DEFAULT now(),
  observer_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.nesting_sites ENABLE ROW LEVEL SECURITY;

-- RLS policies for admin access
CREATE POLICY "Admins can view nesting sites"
ON public.nesting_sites FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert nesting sites"
ON public.nesting_sites FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update nesting sites"
ON public.nesting_sites FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete nesting sites"
ON public.nesting_sites FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.nesting_sites;

-- Add updated_at trigger
CREATE TRIGGER update_nesting_sites_updated_at
BEFORE UPDATE ON public.nesting_sites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with initial Wellfleet Harbor nesting sites
INSERT INTO public.nesting_sites (site_id, name, latitude, longitude, status, eggs, chicks, threat_level, observer_notes) VALUES
('WH-001', 'Mayo Beach North', 41.9284, -70.0318, 'active', 4, 0, 'low', 'Nest established May 15. Pair actively incubating.'),
('WH-002', 'Indian Neck', 41.9156, -70.0421, 'active', 3, 2, 'medium', 'Two chicks hatched June 1. Crow activity noted.'),
('WH-003', 'Lieutenant Island', 41.9089, -70.0567, 'fledged', 0, 0, 'low', 'All 4 chicks successfully fledged July 12.'),
('WH-004', 'Great Island Trail', 41.8934, -70.0712, 'active', 4, 0, 'high', 'Fox tracks observed near exclosure. Extra monitoring.'),
('WH-005', 'Duck Harbor', 41.8812, -70.0834, 'abandoned', 0, 0, 'low', 'Nest abandoned after storm surge June 8.');