DROP POLICY IF EXISTS "Office admins can view photo batches" ON public.photo_batches;
DROP POLICY IF EXISTS "Office admins can manage photo batches" ON public.photo_batches;

CREATE POLICY "Office staff can view photo batches"
  ON public.photo_batches
  FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'moderator')
  );

CREATE POLICY "Office staff can manage photo batches"
  ON public.photo_batches
  FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'moderator')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'moderator')
  );