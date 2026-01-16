-- Drop the security definer view and recreate with proper security invoker
DROP VIEW IF EXISTS public.lovable_listings;

-- Create view with SECURITY INVOKER (respects caller's RLS policies)
CREATE VIEW public.lovable_listings 
WITH (security_invoker = true) AS
SELECT *
FROM public.sourced_products
WHERE approved_for_listing = true
  AND lovable_margin_percent > 60;