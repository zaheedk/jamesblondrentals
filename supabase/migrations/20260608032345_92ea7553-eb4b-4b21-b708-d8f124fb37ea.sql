
-- Revoke EXECUTE on internal SECURITY DEFINER functions from public/anon/authenticated.
-- These are called via triggers or admin paths and should not be invokable from the API.
REVOKE EXECUTE ON FUNCTION public.generate_booking_reference() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_customer_id() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_user_email(uuid) FROM PUBLIC, anon, authenticated;

-- has_role and is_admin_user are used inside RLS policies and must remain callable by signed-in users,
-- but revoke from anon since unauthenticated callers don't need them.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin_user() FROM PUBLIC, anon;

-- Tighten the booking_feedback insert policy: rating must be in 1..5 instead of WITH CHECK (true).
DROP POLICY IF EXISTS "Anyone can insert feedback" ON public.booking_feedback;
CREATE POLICY "Anyone can insert feedback"
ON public.booking_feedback
FOR INSERT
TO anon, authenticated
WITH CHECK (rating BETWEEN 1 AND 5);
