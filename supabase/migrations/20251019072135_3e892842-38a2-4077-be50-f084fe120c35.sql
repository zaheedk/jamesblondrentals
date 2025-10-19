-- Create customers table to store customer information
CREATE TABLE public.customers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_id text UNIQUE,
  last_name text NOT NULL,
  first_name text NOT NULL,
  dob date,
  mobile text,
  phone text,
  email text NOT NULL,
  address text,
  city text,
  state_province text,
  postcode text,
  license_number text,
  passport_number text,
  country text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index on email for faster lookups
CREATE INDEX idx_customers_email ON public.customers(email);

-- Create index on customer_id for faster lookups
CREATE INDEX idx_customers_customer_id ON public.customers(customer_id);

-- Function to generate customer ID
CREATE OR REPLACE FUNCTION public.generate_customer_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.customer_id IS NULL THEN
    NEW.customer_id := 'CUST' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6));
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger to auto-generate customer ID
CREATE TRIGGER generate_customer_id_trigger
BEFORE INSERT ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.generate_customer_id();

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Allow admins to view all customers
CREATE POLICY "Admins can view all customers"
ON public.customers
FOR SELECT
USING (is_admin_user());

-- Allow admins to insert customers
CREATE POLICY "Admins can insert customers"
ON public.customers
FOR INSERT
WITH CHECK (is_admin_user());

-- Allow admins to update customers
CREATE POLICY "Admins can update customers"
ON public.customers
FOR UPDATE
USING (is_admin_user());

-- Allow admins to delete customers
CREATE POLICY "Admins can delete customers"
ON public.customers
FOR DELETE
USING (is_admin_user());

-- Allow users to view their own customer record
CREATE POLICY "Users can view own customer record"
ON public.customers
FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to update their own customer record
CREATE POLICY "Users can update own customer record"
ON public.customers
FOR UPDATE
USING (auth.uid() = user_id);