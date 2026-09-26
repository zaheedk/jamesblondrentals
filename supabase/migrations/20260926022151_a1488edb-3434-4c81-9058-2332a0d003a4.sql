CREATE TABLE public.additional_drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  dob date,
  email text,
  phone text,
  address text,
  suburb text,
  city text,
  postcode text,
  country text,
  license_number text,
  license_expiry date,
  license_country text,
  licence_front_path text,
  licence_back_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.additional_drivers TO authenticated;
GRANT ALL ON public.additional_drivers TO service_role;
ALTER TABLE public.additional_drivers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own drivers" ON public.additional_drivers FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all drivers" ON public.additional_drivers FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_additional_drivers_updated_at BEFORE UPDATE ON public.additional_drivers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.saved_payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  provider text NOT NULL DEFAULT 'airwallex',
  provider_customer_id text NOT NULL,
  provider_consent_id text,
  card_brand text,
  card_last4 text,
  card_expiry text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.saved_payment_methods TO authenticated;
GRANT ALL ON public.saved_payment_methods TO service_role;
ALTER TABLE public.saved_payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own card" ON public.saved_payment_methods FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Admins view all cards" ON public.saved_payment_methods FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_saved_payment_methods_updated_at BEFORE UPDATE ON public.saved_payment_methods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS emergency_contact_name text,
  ADD COLUMN IF NOT EXISTS emergency_contact_phone text,
  ADD COLUMN IF NOT EXISTS occupation text;