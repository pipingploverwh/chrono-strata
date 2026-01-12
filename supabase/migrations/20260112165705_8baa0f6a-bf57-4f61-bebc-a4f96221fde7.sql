-- Fix RLS policies to be PERMISSIVE instead of RESTRICTIVE

-- Drop existing restrictive policies on user_roles
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Create PERMISSIVE policies for user_roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing restrictive policies on weather_coordinate_logs
DROP POLICY IF EXISTS "Admins can read weather logs" ON public.weather_coordinate_logs;
DROP POLICY IF EXISTS "Admins can insert weather logs" ON public.weather_coordinate_logs;
DROP POLICY IF EXISTS "Admins can update weather logs" ON public.weather_coordinate_logs;
DROP POLICY IF EXISTS "Admins can delete weather logs" ON public.weather_coordinate_logs;

-- Create PERMISSIVE policies for weather_coordinate_logs
CREATE POLICY "Admins can read weather logs"
ON public.weather_coordinate_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert weather logs"
ON public.weather_coordinate_logs
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update weather logs"
ON public.weather_coordinate_logs
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete weather logs"
ON public.weather_coordinate_logs
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));