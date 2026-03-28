-- Create storage bucket for signed rental agreements
INSERT INTO storage.buckets (id, name, public)
VALUES ('signed-agreements', 'signed-agreements', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read signed agreements (for download links)
CREATE POLICY "Public can view signed agreements"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'signed-agreements');

-- Allow authenticated users to upload signed agreements
CREATE POLICY "Authenticated can upload signed agreements"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'signed-agreements');

-- Allow anon users to upload signed agreements (for public agreement page)
CREATE POLICY "Anon can upload signed agreements"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'signed-agreements');