
DROP POLICY IF EXISTS "Allow payment status updates by booking reference" ON public.bookings;

CREATE OR REPLACE FUNCTION public.update_booking_payment_status_by_reference(
  _references text[],
  _payment_status text,
  _booking_status text,
  _payment_intent_id text DEFAULT NULL,
  _booking_reference text DEFAULT NULL,
  _reservation_reference text DEFAULT NULL
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count integer;
BEGIN
  IF _references IS NULL OR array_length(_references, 1) IS NULL THEN
    RETURN 0;
  END IF;

  IF _payment_status IS NULL OR _booking_status IS NULL THEN
    RAISE EXCEPTION 'payment_status and booking_status are required';
  END IF;

  UPDATE public.bookings
  SET
    payment_status = _payment_status,
    booking_status = _booking_status,
    payment_intent_id = COALESCE(_payment_intent_id, payment_intent_id),
    booking_reference = COALESCE(_booking_reference, booking_reference),
    reservation_reference = COALESCE(_reservation_reference, reservation_reference),
    updated_at = now()
  WHERE booking_reference = ANY(_references)
     OR reservation_reference = ANY(_references);

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

REVOKE ALL ON FUNCTION public.update_booking_payment_status_by_reference(text[], text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_booking_payment_status_by_reference(text[], text, text, text, text, text) TO anon, authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.get_user_email(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_user_email(uuid) FROM anon;
