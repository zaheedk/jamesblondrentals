-- Fix search path for is_admin_user function
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.email = 'zaheedk@gmail.com'
  );
$$;