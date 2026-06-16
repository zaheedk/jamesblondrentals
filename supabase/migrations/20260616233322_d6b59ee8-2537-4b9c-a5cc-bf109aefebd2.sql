DROP POLICY IF EXISTS "Office staff can upload vehicle photos" ON storage.objects;
DROP POLICY IF EXISTS "Office staff can update vehicle photos" ON storage.objects;
DROP POLICY IF EXISTS "Office staff can delete vehicle photos" ON storage.objects;

CREATE POLICY "Office staff can upload vehicle photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'vehicle-photos'
    AND EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role IN ('admin'::public.app_role, 'moderator'::public.app_role)
    )
  );

CREATE POLICY "Office staff can update vehicle photos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'vehicle-photos'
    AND EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role IN ('admin'::public.app_role, 'moderator'::public.app_role)
    )
  )
  WITH CHECK (
    bucket_id = 'vehicle-photos'
    AND EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role IN ('admin'::public.app_role, 'moderator'::public.app_role)
    )
  );

CREATE POLICY "Office staff can delete vehicle photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'vehicle-photos'
    AND EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role IN ('admin'::public.app_role, 'moderator'::public.app_role)
    )
  );