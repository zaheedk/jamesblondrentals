CREATE TABLE public.voice_booking_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 request_id text NOT NULL UNIQUE,
 request_data jsonb NOT NULL,
 reservation_reference text UNIQUE,
 reservation_number text,
 state text NOT NULL DEFAULT 'creating',
 expected_amount numeric,
 quote_email_id text,
 confirmation_email_id text,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.voice_booking_requests TO authenticated;
GRANT ALL ON public.voice_booking_requests TO service_role;
ALTER TABLE public.voice_booking_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Administrators can view phone quote requests" ON public.voice_booking_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_voice_booking_requests_updated_at BEFORE UPDATE ON public.voice_booking_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();