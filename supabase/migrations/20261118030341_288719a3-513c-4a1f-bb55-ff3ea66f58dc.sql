DROP POLICY IF EXISTS "Anyone can view rental rates" ON public.vehicle_rental_rates;
CREATE POLICY "Staff can view rental rates" ON public.vehicle_rental_rates FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator'));

DROP POLICY IF EXISTS "Anyone can log a search event" ON public.search_events;
CREATE POLICY "Visitors can log their own search events" ON public.search_events FOR INSERT TO anon, authenticated
WITH CHECK (
  (user_id IS NULL OR user_id = auth.uid())
  AND (session_id IS NULL OR length(session_id) <= 200)
  AND (promo_code IS NULL OR length(promo_code) <= 100)
  AND (page_path IS NULL OR length(page_path) <= 2000)
  AND (referrer IS NULL OR length(referrer) <= 2000)
  AND (user_agent IS NULL OR length(user_agent) <= 1000)
);

DROP POLICY IF EXISTS "Anyone can upload signed agreement PDFs" ON storage.objects;