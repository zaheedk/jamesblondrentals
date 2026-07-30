-- Composite indexes matching the real member/admin booking queries
CREATE INDEX IF NOT EXISTS idx_bookings_user_id_pickup_date ON public.bookings (user_id, pickup_date DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email_pickup_date ON public.bookings (customer_email, pickup_date DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_rego ON public.bookings (vehicle_rego);
CREATE INDEX IF NOT EXISTS idx_bookings_dropoff_date ON public.bookings (dropoff_date);

-- Signed rental agreement lookups (reservation_reference + signed rows only)
CREATE INDEX IF NOT EXISTS idx_bookings_signed_reservation_ref
  ON public.bookings (reservation_reference)
  WHERE hirer_signature IS NOT NULL;

-- Text search used by admin booking/customer screens
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;
CREATE INDEX IF NOT EXISTS idx_bookings_customer_last_name_trgm
  ON public.bookings USING gin (lower(customer_last_name) extensions.gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email_trgm
  ON public.bookings USING gin (lower(customer_email) extensions.gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_customers_last_name_trgm
  ON public.customers USING gin (lower(last_name) extensions.gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_customers_first_name_trgm
  ON public.customers USING gin (lower(first_name) extensions.gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_customers_email_trgm
  ON public.customers USING gin (lower(email) extensions.gin_trgm_ops);

-- Drop redundant duplicate indexes (write overhead with no read benefit)
DROP INDEX IF EXISTS public.idx_bookings_pickup_date;          -- superseded by idx_bookings_pickup_date_desc
DROP INDEX IF EXISTS public.photo_batches_sort_key_idx;        -- duplicate of idx_photo_batches_sort_key_desc
DROP INDEX IF EXISTS public.photo_batches_reservation_idx;     -- covered by the unique (reservation_no, rego, batch_id) index

ANALYZE public.bookings;
ANALYZE public.customers;
ANALYZE public.photo_batches;
ANALYZE public.search_events;