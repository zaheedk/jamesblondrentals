DROP POLICY IF EXISTS "Office staff can view photo batches" ON public.photo_batches;
DROP POLICY IF EXISTS "Office staff can manage photo batches" ON public.photo_batches;

CREATE POLICY "Office staff can view photo batches"
  ON public.photo_batches
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = ANY (ARRAY['admin'::public.app_role, 'moderator'::public.app_role])
    )
  );

CREATE POLICY "Office staff can manage photo batches"
  ON public.photo_batches
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = ANY (ARRAY['admin'::public.app_role, 'moderator'::public.app_role])
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = ANY (ARRAY['admin'::public.app_role, 'moderator'::public.app_role])
    )
  );