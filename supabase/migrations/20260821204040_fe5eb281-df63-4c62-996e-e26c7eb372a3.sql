CREATE TABLE public.payment_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider text NOT NULL DEFAULT 'airwallex',
  provider_intent_id text,
  provider_payment_method text,
  reservation_reference text,
  booking_reference text,
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'NZD',
  status text NOT NULL DEFAULT 'pending',
  customer_email text,
  raw_payload jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX payment_transactions_provider_intent_key
  ON public.payment_transactions (provider, provider_intent_id)
  WHERE provider_intent_id IS NOT NULL;

CREATE INDEX payment_transactions_reservation_idx
  ON public.payment_transactions (reservation_reference);

GRANT ALL ON public.payment_transactions TO service_role;
GRANT SELECT ON public.payment_transactions TO authenticated;

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view payment transactions"
  ON public.payment_transactions
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();