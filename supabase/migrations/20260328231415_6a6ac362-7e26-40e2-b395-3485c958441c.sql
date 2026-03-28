INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-photos', 'vehicle-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can upload vehicle photos"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'vehicle-photos');

CREATE POLICY "Anyone can view vehicle photos"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'vehicle-photos');