CREATE POLICY "Temp allow anon bulk insert"
ON public.bookings
FOR INSERT
TO anon
WITH CHECK (true);