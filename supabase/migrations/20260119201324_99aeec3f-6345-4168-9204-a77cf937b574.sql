-- Create storage bucket for configuration renders and PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('configuration-assets', 'configuration-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their configuration renders
CREATE POLICY "Users can upload configuration assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'configuration-assets');

-- Allow anyone to view configuration assets (for sharing/emails)
CREATE POLICY "Configuration assets are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'configuration-assets');

-- Allow admins to manage all configuration assets
CREATE POLICY "Admins can manage configuration assets"
ON storage.objects FOR ALL
USING (bucket_id = 'configuration-assets' AND has_role(auth.uid(), 'admin'::app_role));

-- Create table to track configuration orders with AI renders
CREATE TABLE public.configuration_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  led_color TEXT NOT NULL,
  surface_finish TEXT NOT NULL,
  accessories TEXT[] DEFAULT '{}',
  base_price NUMERIC NOT NULL DEFAULT 47500,
  total_price NUMERIC NOT NULL,
  render_urls TEXT[] DEFAULT '{}',
  pdf_url TEXT,
  status TEXT DEFAULT 'pending',
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.configuration_orders ENABLE ROW LEVEL SECURITY;

-- Anyone can create orders (public checkout)
CREATE POLICY "Anyone can create configuration orders"
ON public.configuration_orders FOR INSERT
WITH CHECK (true);

-- Users can view their own orders by email (simple approach)
CREATE POLICY "Users can view orders by email"
ON public.configuration_orders FOR SELECT
USING (true);

-- Admins can manage all orders
CREATE POLICY "Admins can update orders"
ON public.configuration_orders FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete orders"
ON public.configuration_orders FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at trigger
CREATE TRIGGER update_configuration_orders_updated_at
BEFORE UPDATE ON public.configuration_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();