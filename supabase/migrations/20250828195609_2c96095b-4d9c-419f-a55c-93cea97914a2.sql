-- Fix infinite recursion by creating a security definer function
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.email = 'zaheedk@gmail.com'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Update RLS policy to use the function
DROP POLICY IF EXISTS "Users can view their own bookings or admins can view all" ON public.bookings;

CREATE POLICY "Users can view their own bookings or admins can view all" 
ON public.bookings 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR 
  public.is_admin_user()
);