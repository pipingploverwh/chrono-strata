-- Create a function to call the edge function when threat_level becomes 'high'
CREATE OR REPLACE FUNCTION public.notify_threat_alert()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
BEGIN
  -- Only trigger when threat_level changes to 'high'
  IF NEW.threat_level = 'high' AND (OLD.threat_level IS NULL OR OLD.threat_level != 'high') THEN
    payload := jsonb_build_object(
      'site_id', NEW.site_id,
      'name', NEW.name,
      'latitude', NEW.latitude,
      'longitude', NEW.longitude,
      'eggs', NEW.eggs,
      'chicks', NEW.chicks,
      'observer_notes', NEW.observer_notes,
      'last_check', NEW.last_check,
      'updated_at', NEW.updated_at
    );
    
    -- Log the threat for auditing
    RAISE LOG 'High threat detected at nesting site: %', NEW.site_id;
    
    -- Use pg_net to call the edge function (async HTTP request)
    PERFORM net.http_post(
      url := current_setting('app.settings.supabase_url', true) || '/functions/v1/plover-threat-alert',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := payload
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create the trigger
DROP TRIGGER IF EXISTS on_threat_level_high ON public.nesting_sites;
CREATE TRIGGER on_threat_level_high
  AFTER UPDATE ON public.nesting_sites
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_threat_alert();

-- Create a threat_logs table to track all threat alerts
CREATE TABLE IF NOT EXISTS public.threat_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id TEXT NOT NULL,
  site_name TEXT NOT NULL,
  threat_level TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  eggs INTEGER,
  chicks INTEGER,
  observer_notes TEXT,
  alert_sent BOOLEAN DEFAULT false,
  alert_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on threat_logs
ALTER TABLE public.threat_logs ENABLE ROW LEVEL SECURITY;

-- Admin-only policies for threat_logs
CREATE POLICY "Admins can view threat logs" ON public.threat_logs
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service can insert threat logs" ON public.threat_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update threat logs" ON public.threat_logs
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for threat_logs
ALTER PUBLICATION supabase_realtime ADD TABLE public.threat_logs;