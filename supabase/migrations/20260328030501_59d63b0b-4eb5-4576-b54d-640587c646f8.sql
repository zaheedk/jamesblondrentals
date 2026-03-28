CREATE TABLE public.rental_agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_ref text NOT NULL,
  booking_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  hirer_signature text,
  additional_driver_signature text,
  signed_at timestamp with time zone,
  signed_by_name text,
  kms_out text,
  kms_in text,
  fuel_out text,
  fuel_in text,
  vehicle_rego text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

ALTER TABLE public.rental_agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view rental agreements"
  ON public.rental_agreements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert rental agreements"
  ON public.rental_agreements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update rental agreements"
  ON public.rental_agreements FOR UPDATE
  TO authenticated
  USING (true);