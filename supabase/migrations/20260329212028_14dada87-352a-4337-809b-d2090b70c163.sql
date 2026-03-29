-- Update bookings SELECT policy to allow office admins (moderators) to view all bookings
DROP POLICY IF EXISTS "Users can view their own bookings or admins can view all" ON public.bookings;

CREATE POLICY "Users can view their own bookings or admins can view all"
ON public.bookings
FOR SELECT
TO public
USING (
  (auth.uid() = user_id)
  OR is_admin_user()
  OR public.has_role(auth.uid(), 'moderator')
);