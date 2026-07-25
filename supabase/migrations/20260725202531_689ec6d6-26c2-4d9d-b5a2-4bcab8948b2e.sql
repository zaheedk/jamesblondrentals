GRANT SELECT, INSERT, UPDATE, DELETE ON public.photo_batches TO authenticated;
GRANT ALL ON public.photo_batches TO service_role;

CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE public.photo_batches
  ADD COLUMN IF NOT EXISTS reservation_search text GENERATED ALWAYS AS (upper(regexp_replace(reservation_no, '[\s\-_]+', '', 'g'))) STORED,
  ADD COLUMN IF NOT EXISTS rego_search text GENERATED ALWAYS AS (upper(regexp_replace(rego, '[\s\-_]+', '', 'g'))) STORED;

CREATE INDEX IF NOT EXISTS idx_photo_batches_reservation_search_trgm
  ON public.photo_batches USING gin (reservation_search gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_photo_batches_rego_search_trgm
  ON public.photo_batches USING gin (rego_search gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_photo_batches_sort_key_desc
  ON public.photo_batches (sort_key DESC);

WITH parsed AS (
  SELECT
    split_part(name, '/', 1) AS reservation_no,
    CASE
      WHEN array_length(string_to_array(name, '/'), 1) >= 2 THEN split_part(name, '/', 2)
      ELSE ''
    END AS rego,
    CASE
      WHEN array_length(string_to_array(name, '/'), 1) >= 4 AND split_part(name, '/', 3) LIKE 'batch-%' THEN split_part(name, '/', 3)
      WHEN array_length(string_to_array(name, '/'), 1) >= 3 THEN 'legacy-rego'
      ELSE 'legacy-flat'
    END AS batch_id,
    created_at
  FROM storage.objects
  WHERE bucket_id = 'vehicle-photos'
    AND name IS NOT NULL
    AND name <> ''
), grouped AS (
  SELECT
    reservation_no,
    coalesce(rego, '') AS rego,
    batch_id,
    CASE
      WHEN batch_id LIKE 'batch-%' THEN to_char(to_timestamp(nullif(substring(batch_id from 'batch-([0-9]+)'), '')::bigint / 1000), 'DD/MM/YYYY, HH12:MI AM')
      ELSE 'Earlier uploads'
    END AS batch_label,
    CASE
      WHEN batch_id LIKE 'batch-%' THEN nullif(substring(batch_id from 'batch-([0-9]+)'), '')::bigint
      ELSE floor(extract(epoch FROM min(created_at)) * 1000)::bigint
    END AS sort_key,
    count(*)::integer AS photo_count
  FROM parsed
  WHERE reservation_no <> ''
  GROUP BY reservation_no, coalesce(rego, ''), batch_id
)
INSERT INTO public.photo_batches (
  reservation_no,
  rego,
  batch_id,
  batch_label,
  sort_key,
  photo_count
)
SELECT
  reservation_no,
  rego,
  batch_id,
  batch_label,
  sort_key,
  photo_count
FROM grouped
WHERE batch_id IS NOT NULL
ON CONFLICT (reservation_no, rego, batch_id) DO UPDATE SET
  batch_label = EXCLUDED.batch_label,
  sort_key = EXCLUDED.sort_key,
  photo_count = EXCLUDED.photo_count,
  updated_at = now();