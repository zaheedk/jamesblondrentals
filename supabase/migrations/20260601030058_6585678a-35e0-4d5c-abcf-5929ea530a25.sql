
-- 1) Blog articles: admin-only writes
DROP POLICY IF EXISTS "Authenticated users can create articles" ON public.blog_articles;
DROP POLICY IF EXISTS "Authenticated users can update articles" ON public.blog_articles;
DROP POLICY IF EXISTS "Authenticated users can delete articles" ON public.blog_articles;

CREATE POLICY "Admins can create articles"
ON public.blog_articles FOR INSERT TO authenticated
WITH CHECK (public.is_admin_user());

CREATE POLICY "Admins can update articles"
ON public.blog_articles FOR UPDATE TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

CREATE POLICY "Admins can delete articles"
ON public.blog_articles FOR DELETE TO authenticated
USING (public.is_admin_user());

-- 2) low_cost_rental_blogs: admin-only writes
DROP POLICY IF EXISTS "Authenticated users can create articles" ON public.low_cost_rental_blogs;
DROP POLICY IF EXISTS "Authenticated users can update articles" ON public.low_cost_rental_blogs;
DROP POLICY IF EXISTS "Authenticated users can delete articles" ON public.low_cost_rental_blogs;

CREATE POLICY "Admins can create articles"
ON public.low_cost_rental_blogs FOR INSERT TO authenticated
WITH CHECK (public.is_admin_user());

CREATE POLICY "Admins can update articles"
ON public.low_cost_rental_blogs FOR UPDATE TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

CREATE POLICY "Admins can delete articles"
ON public.low_cost_rental_blogs FOR DELETE TO authenticated
USING (public.is_admin_user());

-- 3) booking_feedback: stop exposing anonymous rows publicly
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.booking_feedback;

CREATE POLICY "Users can view their own feedback"
ON public.booking_feedback FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback"
ON public.booking_feedback FOR SELECT TO authenticated
USING (public.is_admin_user());

-- 4) vehicle_rental_rates: admin-only writes
DROP POLICY IF EXISTS "Authenticated users can insert rental rates" ON public.vehicle_rental_rates;
DROP POLICY IF EXISTS "Authenticated users can update rental rates" ON public.vehicle_rental_rates;

CREATE POLICY "Admins can insert rental rates"
ON public.vehicle_rental_rates FOR INSERT TO authenticated
WITH CHECK (public.is_admin_user());

CREATE POLICY "Admins can update rental rates"
ON public.vehicle_rental_rates FOR UPDATE TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- 5) Storage: vehicle-photos — restrict writes to authenticated users
DROP POLICY IF EXISTS "Anyone can upload vehicle photos" ON storage.objects;

CREATE POLICY "Authenticated can upload vehicle photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'vehicle-photos');

CREATE POLICY "Authenticated can update vehicle photos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'vehicle-photos')
WITH CHECK (bucket_id = 'vehicle-photos');

CREATE POLICY "Authenticated can delete vehicle photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'vehicle-photos');
