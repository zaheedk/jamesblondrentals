CREATE POLICY "Users can insert own customer record"
ON public.customers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);