
-- Vehicle fields
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS car_id text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS brand text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS transmission text;

-- Booking metadata
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS converted_from text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_type text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS date_booked timestamp with time zone;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS date_closed timestamp with time zone;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booked_by text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS hired_by text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS source text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS rcm_customer_id text;

-- Traveller info
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS youngest_driver integer;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS no_travelling integer;

-- Agency / referral
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS agency text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS agency_branch text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS agent_name text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS agent_email text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS referrals text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS referral_name text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS reference_no text;

-- Customer details
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS company_name text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_dob date;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS license_issued text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS license_exp_date date;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS occupation text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_suburb text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_state text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_postcode text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_country text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS local_address text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_mobile text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_fax text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS mailing_list text;

-- Extra fees (10 pairs: name + value)
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS extra_fee_1 text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS extra_fee_1_value numeric;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS extra_fee_2 text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS extra_fee_2_value numeric;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS extra_fee_3 text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS extra_fee_3_value numeric;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS extra_fee_4 text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS extra_fee_4_value numeric;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS extra_fee_5 text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS extra_fee_5_value numeric;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS extra_fee_6 text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS extra_fee_6_value numeric;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS extra_fee_7 text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS extra_fee_7_value numeric;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS extra_fee_8 text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS extra_fee_8_value numeric;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS extra_fee_9 text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS extra_fee_9_value numeric;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS extra_fee_10 text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS extra_fee_10_value numeric;

-- Financial
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS state_tax numeric;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS sales_tax numeric;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_total numeric;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS agent_commission numeric;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS agent_collected numeric;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS insurance_fee numeric;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS total_extra_inc_insurance numeric;

-- RCM ref (keeps existing reservation_reference intact)
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS rcm_ref_no text;
