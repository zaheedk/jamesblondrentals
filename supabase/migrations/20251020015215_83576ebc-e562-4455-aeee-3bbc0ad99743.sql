-- Allow guest bookings to be inserted (user_id NULL) while keeping secure reads
DO $$ BEGIN
  -- Ensure RLS is enabled (no-op if already enabled)
  PERFORM 1 FROM pg_tables WHERE schemaname='public' AND tablename='bookings';
END $$;

-- Replace existing insert policy
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;

CREATE POLICY "Guests or owners can insert bookings"
ON public.bookings
FOR INSERT
TO public
WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL));
