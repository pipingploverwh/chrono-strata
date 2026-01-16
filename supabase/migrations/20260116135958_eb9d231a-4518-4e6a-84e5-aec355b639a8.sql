-- Add new columns to sourced_products
ALTER TABLE public.sourced_products
ADD COLUMN IF NOT EXISTS supplier_name text,
ADD COLUMN IF NOT EXISTS in_stock boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS ships_to text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS crawl_session_id text,
ADD COLUMN IF NOT EXISTS scraped_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS approved_for_listing boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS notes text;

-- Add computed lovable_margin_percent column (replacing manual gross_margin)
ALTER TABLE public.sourced_products
ADD COLUMN IF NOT EXISTS lovable_margin_percent numeric(5,2) GENERATED ALWAYS AS (
  CASE 
    WHEN suggested_retail_price > 0 THEN ((suggested_retail_price - cost_price) / suggested_retail_price) * 100
    ELSE 0
  END
) STORED;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_sourced_products_tags ON public.sourced_products USING gin (tags);
CREATE INDEX IF NOT EXISTS idx_sourced_products_margin ON public.sourced_products (lovable_margin_percent);
CREATE INDEX IF NOT EXISTS idx_sourced_products_scraped_at ON public.sourced_products (scraped_at DESC);
CREATE INDEX IF NOT EXISTS idx_sourced_products_approved ON public.sourced_products (approved_for_listing) WHERE approved_for_listing = true;

-- Create view for approved high-margin listings
CREATE OR REPLACE VIEW public.lovable_listings AS
SELECT *
FROM public.sourced_products
WHERE approved_for_listing = true
  AND lovable_margin_percent > 60;