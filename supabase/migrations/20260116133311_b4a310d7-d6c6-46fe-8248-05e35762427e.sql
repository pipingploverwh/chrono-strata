-- Create sourced_products table for Lavender AI Org
CREATE TABLE public.sourced_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  original_source_url TEXT NOT NULL,
  cost_price DECIMAL(10,2) NOT NULL,
  suggested_retail_price DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  sourcing_confidence INTEGER CHECK (sourcing_confidence >= 0 AND sourcing_confidence <= 100),
  category TEXT,
  supplier_rating DECIMAL(2,1),
  image_urls TEXT[] DEFAULT '{}',
  stock_status TEXT DEFAULT 'unknown',
  gross_margin DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  scraped_raw_content TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'listed'))
);

-- Enable Row Level Security
ALTER TABLE public.sourced_products ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can view sourced products" 
ON public.sourced_products 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert sourced products" 
ON public.sourced_products 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update sourced products" 
ON public.sourced_products 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete sourced products" 
ON public.sourced_products 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_sourced_products_updated_at
BEFORE UPDATE ON public.sourced_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for common queries
CREATE INDEX idx_sourced_products_status ON public.sourced_products(status);
CREATE INDEX idx_sourced_products_category ON public.sourced_products(category);
CREATE INDEX idx_sourced_products_margin ON public.sourced_products(gross_margin DESC);