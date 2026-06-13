
DROP POLICY IF EXISTS "Public can view signed agreements" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload signed agreements" ON storage.objects;
DROP POLICY IF EXISTS "Anon can upload signed agreements" ON storage.objects;

CREATE POLICY "Anyone can upload signed agreement PDFs"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'signed-agreements'
  AND lower(storage.extension(name)) = 'pdf'
);

CREATE POLICY "Authenticated users can read signed agreements"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'signed-agreements');
