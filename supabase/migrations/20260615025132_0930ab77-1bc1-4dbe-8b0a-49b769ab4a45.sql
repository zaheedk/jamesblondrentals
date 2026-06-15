DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;

CREATE POLICY "Admins can upload blog images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-images' AND public.is_admin_user());

CREATE POLICY "Admins can update blog images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-images' AND public.is_admin_user())
  WITH CHECK (bucket_id = 'blog-images' AND public.is_admin_user());

CREATE POLICY "Admins can delete blog images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'blog-images' AND public.is_admin_user());

DROP POLICY IF EXISTS "Authenticated can upload vehicle photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update vehicle photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete vehicle photos" ON storage.objects;

CREATE POLICY "Admins can upload vehicle photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'vehicle-photos' AND public.is_admin_user());

CREATE POLICY "Admins can update vehicle photos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'vehicle-photos' AND public.is_admin_user())
  WITH CHECK (bucket_id = 'vehicle-photos' AND public.is_admin_user());

CREATE POLICY "Admins can delete vehicle photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'vehicle-photos' AND public.is_admin_user());

DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;

CREATE POLICY "Owners or admins can update bookings"
  ON public.bookings FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.is_admin_user())
  WITH CHECK (auth.uid() = user_id OR public.is_admin_user());