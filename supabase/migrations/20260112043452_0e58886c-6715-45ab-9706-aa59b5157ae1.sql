-- Create weather coordinate logs table
CREATE TABLE public.weather_coordinate_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  location_name TEXT,
  page_source TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.weather_coordinate_logs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert logs (anonymous tracking)
CREATE POLICY "Anyone can insert weather logs"
ON public.weather_coordinate_logs
FOR INSERT
WITH CHECK (true);

-- Allow reading all logs (for analytics/admin purposes)
CREATE POLICY "Anyone can read weather logs"
ON public.weather_coordinate_logs
FOR SELECT
USING (true);

-- Create index for efficient timestamp queries
CREATE INDEX idx_weather_logs_created_at ON public.weather_coordinate_logs(created_at DESC);

-- Create index for session lookups
CREATE INDEX idx_weather_logs_session ON public.weather_coordinate_logs(session_id);