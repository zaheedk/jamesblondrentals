-- Allow anonymous users to insert rental agreements (public signing page)
CREATE POLICY "Anon can insert rental agreements"
ON public.rental_agreements FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anonymous users to view rental agreements by reservation ref (for checking if already signed)
CREATE POLICY "Anon can view rental agreements"
ON public.rental_agreements FOR SELECT
TO anon
USING (true);