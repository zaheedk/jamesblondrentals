DROP POLICY "Users can view their own bookings or admins can view all" ON bookings;
CREATE POLICY "Users can view their own bookings or admins can view all" ON bookings
FOR SELECT USING (
  auth.uid() = user_id
  OR customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  OR is_admin_user()
  OR has_role(auth.uid(), 'moderator'::app_role)
);