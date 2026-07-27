CREATE TABLE public.search_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NULL,
  session_id text NULL,
  pickup_location_id text NULL,
  pickup_location_name text NULL,
  dropoff_location_id text NULL,
  dropoff_location_name text NULL,
  same_location boolean NULL,
  category_id text NULL,
  category_name text NULL,
  pickup_date text NULL,
  dropoff_date text NULL,
  pickup_time text NULL,
  dropoff_time text NULL,
  driver_age_id text NULL,
  has_promo_code boolean NULL,
  promo_code text NULL,
  page_path text NULL,
  referrer text NULL,
  user_agent text NULL
);

GRANT INSERT ON public.search_events TO anon;
GRANT INSERT, SELECT ON public.search_events TO authenticated;
GRANT ALL ON public.search_events TO service_role;

ALTER TABLE public.search_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log a search event"
  ON public.search_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view search events"
  ON public.search_events
  FOR SELECT
  TO authenticated
  USING (public.is_admin_user());

CREATE INDEX idx_search_events_created_at ON public.search_events (created_at DESC);
CREATE INDEX idx_search_events_pickup_location ON public.search_events (pickup_location_name);
CREATE INDEX idx_search_events_category ON public.search_events (category_name);