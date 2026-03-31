-- Fix the RLS policy to not reference auth.users directly
-- Use a security definer function instead
CREATE OR REPLACE FUNCTION public.get_user_email(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM auth.users WHERE id = _user_id;
$$;

DROP POLICY "Users can view their own bookings or admins can view all" ON bookings;
CREATE POLICY "Users can view their own bookings or admins can view all" ON bookings
FOR SELECT USING (
  auth.uid() = user_id
  OR customer_email = public.get_user_email(auth.uid())
  OR is_admin_user()
  OR has_role(auth.uid(), 'moderator'::app_role)
);