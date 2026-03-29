ALTER TABLE public.customers 
ADD COLUMN IF NOT EXISTS license_expiry date NULL,
ADD COLUMN IF NOT EXISTS license_country text NULL,
ADD COLUMN IF NOT EXISTS suburb text NULL;