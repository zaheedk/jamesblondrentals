
-- Bookings: high-volume lookups
CREATE INDEX IF NOT EXISTS idx_bookings_reservation_reference ON public.bookings (reservation_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings (payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_intent_id ON public.bookings (payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON public.bookings (customer_email);
CREATE INDEX IF NOT EXISTS idx_bookings_pickup_date_desc ON public.bookings (pickup_date DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_pickup_location_id ON public.bookings (pickup_location_id);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_category ON public.bookings (vehicle_category);

-- Booking feedback
CREATE INDEX IF NOT EXISTS idx_booking_feedback_booking_reference ON public.booking_feedback (booking_reference);
CREATE INDEX IF NOT EXISTS idx_booking_feedback_user_id ON public.booking_feedback (user_id);
CREATE INDEX IF NOT EXISTS idx_booking_feedback_customer_email ON public.booking_feedback (customer_email);
CREATE INDEX IF NOT EXISTS idx_booking_feedback_created_at ON public.booking_feedback (created_at DESC);

-- Customers
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers (user_id);
CREATE INDEX IF NOT EXISTS idx_customers_mobile ON public.customers (mobile);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers (phone);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON public.customers (created_at DESC);

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);

-- User roles
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles (user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles (role);

-- Blog articles
CREATE INDEX IF NOT EXISTS idx_blog_articles_published_created ON public.blog_articles (published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_articles_category ON public.blog_articles (category);

-- Low cost rental blogs
CREATE INDEX IF NOT EXISTS idx_lcrb_published_created ON public.low_cost_rental_blogs (published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lcrb_category ON public.low_cost_rental_blogs (category);

-- Search events
CREATE INDEX IF NOT EXISTS idx_search_events_session_id ON public.search_events (session_id);
CREATE INDEX IF NOT EXISTS idx_search_events_user_id ON public.search_events (user_id);

-- Vehicle rental rates (composite for typical dashboard filters)
CREATE INDEX IF NOT EXISTS idx_vrr_website_category_scraped ON public.vehicle_rental_rates (website_name, vehicle_category, scraped_at DESC);

-- Refresh planner stats
ANALYZE public.bookings;
ANALYZE public.booking_feedback;
ANALYZE public.customers;
ANALYZE public.profiles;
ANALYZE public.user_roles;
ANALYZE public.blog_articles;
ANALYZE public.low_cost_rental_blogs;
ANALYZE public.search_events;
ANALYZE public.vehicle_rental_rates;
