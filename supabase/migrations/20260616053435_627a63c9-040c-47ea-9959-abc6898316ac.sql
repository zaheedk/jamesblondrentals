DROP POLICY IF EXISTS "Admins can upload vehicle photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update vehicle photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete vehicle photos" ON storage.objects;

CREATE POLICY "Office staff can upload vehicle photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'vehicle-photos'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
  );

CREATE POLICY "Office staff can update vehicle photos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'vehicle-photos'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
  )
  WITH CHECK (
    bucket_id = 'vehicle-photos'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
  );

CREATE POLICY "Office staff can delete vehicle photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'vehicle-photos'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
  );