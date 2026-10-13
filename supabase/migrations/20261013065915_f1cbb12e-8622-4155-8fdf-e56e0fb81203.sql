CREATE TABLE public.quote_reminder_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference text NOT NULL,
  customer_email text NOT NULL,
  kind text NOT NULL,
  email_id text,
  sent_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (booking_reference, kind)
);
GRANT SELECT ON public.quote_reminder_log TO authenticated;
GRANT ALL ON public.quote_reminder_log TO service_role;
ALTER TABLE public.quote_reminder_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view reminder log" ON public.quote_reminder_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

SELECT vault.create_secret(encode(extensions.gen_random_bytes(32), 'hex'), 'quote_reminder_cron_token');

CREATE OR REPLACE FUNCTION public.verify_quote_reminder_cron_token(_token text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM vault.decrypted_secrets WHERE name = 'quote_reminder_cron_token' AND decrypted_secret = _token);
$$;
REVOKE ALL ON FUNCTION public.verify_quote_reminder_cron_token(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_quote_reminder_cron_token(text) TO service_role;