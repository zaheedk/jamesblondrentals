
-- Step 1: Add rental agreement columns to bookings
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS vehicle_rego text,
ADD COLUMN IF NOT EXISTS booking_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS kms_in text,
ADD COLUMN IF NOT EXISTS kms_out text,
ADD COLUMN IF NOT EXISTS fuel_in text,
ADD COLUMN IF NOT EXISTS fuel_out text,
ADD COLUMN IF NOT EXISTS hirer_signature text,
ADD COLUMN IF NOT EXISTS additional_driver_signature text,
ADD COLUMN IF NOT EXISTS signed_by_name text,
ADD COLUMN IF NOT EXISTS signed_at timestamptz,
ADD COLUMN IF NOT EXISTS created_by uuid;

-- Step 2: Add import tracking columns to bookings
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS import_data jsonb,
ADD COLUMN IF NOT EXISTS import_file_name text,
ADD COLUMN IF NOT EXISTS import_row_count integer,
ADD COLUMN IF NOT EXISTS uploaded_at timestamptz,
ADD COLUMN IF NOT EXISTS processed_at timestamptz;

-- Step 3: Drop unique constraint on booking_reference
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_booking_reference_key;

-- Step 4: Migrate rental_agreements into bookings
INSERT INTO public.bookings (
  reservation_reference,
  booking_reference,
  vehicle_rego,
  booking_data,
  kms_in, kms_out, fuel_in, fuel_out,
  hirer_signature, additional_driver_signature, signed_by_name, signed_at,
  created_by, notes, created_at, updated_at,
  booking_status,
  pickup_date, pickup_time, dropoff_date, dropoff_time, total_days,
  pickup_location_name, dropoff_location_name,
  vehicle_category, daily_rate, total_amount
)
SELECT
  ra.booking_data->'bookinginfo'->0->>'reservationno',
  ra.reservation_ref,
  ra.vehicle_rego,
  ra.booking_data,
  ra.kms_in, ra.kms_out, ra.fuel_in, ra.fuel_out,
  ra.hirer_signature, ra.additional_driver_signature, ra.signed_by_name, ra.signed_at,
  ra.created_by, ra.notes, ra.created_at, ra.updated_at,
  COALESCE(ra.booking_data->'bookinginfo'->0->>'reservationstatus', 'agreement'),
  COALESCE(TO_DATE(ra.booking_data->'bookinginfo'->0->>'pickupdate', 'DD/Mon/YYYY'), CURRENT_DATE),
  COALESCE(ra.booking_data->'bookinginfo'->0->>'pickuptime', '09:00')::time,
  COALESCE(TO_DATE(ra.booking_data->'bookinginfo'->0->>'dropoffdate', 'DD/Mon/YYYY'), CURRENT_DATE),
  COALESCE(ra.booking_data->'bookinginfo'->0->>'dropofftime', '17:00')::time,
  GREATEST(1, CEIL(COALESCE(NULLIF(ra.booking_data->'bookinginfo'->0->>'numberofdays', '')::numeric, 1))::integer),
  ra.booking_data->'bookinginfo'->0->>'pickuplocationname',
  ra.booking_data->'bookinginfo'->0->>'dropofflocationname',
  ra.booking_data->'bookinginfo'->0->>'vehiclecategory',
  NULLIF(ra.booking_data->'bookinginfo'->0->>'dailyrate', '')::numeric,
  NULLIF(ra.booking_data->'bookinginfo'->0->>'totalcost', '')::numeric
FROM (
  SELECT DISTINCT ON (reservation_ref) *
  FROM public.rental_agreements
  ORDER BY reservation_ref, signed_at DESC NULLS LAST, created_at DESC
) ra;

-- Step 5: Migrate uploaded_bookings into bookings
INSERT INTO public.bookings (
  booking_reference, booking_status,
  pickup_date, pickup_time, dropoff_date, dropoff_time, total_days,
  pickup_location_name, dropoff_location_name,
  vehicle_type, vehicle_category,
  customer_email, total_amount,
  import_data, import_file_name, import_row_count, uploaded_at, processed_at,
  created_at, updated_at
)
SELECT
  ub.booking_reference,
  COALESCE(ub.booking_status, 'imported'),
  COALESCE(ub.pickup_date, CURRENT_DATE), '09:00'::time,
  COALESCE(ub.dropoff_date, CURRENT_DATE), '17:00'::time,
  GREATEST(1, COALESCE(ub.dropoff_date - ub.pickup_date, 1)),
  ub.pickup_location, ub.dropoff_location,
  ub.vehicle_type, ub.vehicle_category,
  ub.customer_email, ub.total_amount,
  ub.data, ub.file_name, ub.row_count, ub.uploaded_at, ub.processed_at,
  ub.created_at, ub.updated_at
FROM public.uploaded_bookings ub;

-- Step 6: Drop old tables
DROP TABLE IF EXISTS public.uploaded_bookings;
DROP TABLE IF EXISTS public.rental_agreements;
