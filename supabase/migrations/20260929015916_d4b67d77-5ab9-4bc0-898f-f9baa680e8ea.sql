CREATE TABLE public.booking_additional_drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  driver_id uuid NOT NULL REFERENCES public.additional_drivers(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (booking_id, driver_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.booking_additional_drivers TO authenticated;
GRANT ALL ON public.booking_additional_drivers TO service_role;

ALTER TABLE public.booking_additional_drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers view own booking driver assignments"
ON public.booking_additional_drivers
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = booking_id
      AND (b.user_id = auth.uid() OR b.customer_email = public.get_user_email(auth.uid()))
  )
  AND EXISTS (
    SELECT 1 FROM public.additional_drivers d
    WHERE d.id = driver_id AND d.user_id = auth.uid()
  )
);

CREATE POLICY "Customers add own booking driver assignments"
ON public.booking_additional_drivers
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = booking_id
      AND (b.user_id = auth.uid() OR b.customer_email = public.get_user_email(auth.uid()))
  )
  AND EXISTS (
    SELECT 1 FROM public.additional_drivers d
    WHERE d.id = driver_id AND d.user_id = auth.uid()
  )
);

CREATE POLICY "Customers remove own booking driver assignments"
ON public.booking_additional_drivers
FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = booking_id
      AND (b.user_id = auth.uid() OR b.customer_email = public.get_user_email(auth.uid()))
  )
  AND EXISTS (
    SELECT 1 FROM public.additional_drivers d
    WHERE d.id = driver_id AND d.user_id = auth.uid()
  )
);

CREATE POLICY "Admins view all booking driver assignments"
ON public.booking_additional_drivers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX booking_additional_drivers_user_idx ON public.booking_additional_drivers(user_id);
CREATE INDEX booking_additional_drivers_booking_idx ON public.booking_additional_drivers(booking_id);
CREATE INDEX booking_additional_drivers_driver_idx ON public.booking_additional_drivers(driver_id);