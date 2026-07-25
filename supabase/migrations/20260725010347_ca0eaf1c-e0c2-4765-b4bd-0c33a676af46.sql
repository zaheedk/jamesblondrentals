
CREATE TABLE public.photo_batches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reservation_no TEXT NOT NULL,
  rego TEXT NOT NULL DEFAULT '',
  batch_id TEXT NOT NULL,
  batch_label TEXT NOT NULL,
  sort_key BIGINT NOT NULL,
  photo_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (reservation_no, rego, batch_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.photo_batches TO authenticated;
GRANT ALL ON public.photo_batches TO service_role;

ALTER TABLE public.photo_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Office admins can view photo batches"
  ON public.photo_batches FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Office admins can manage photo batches"
  ON public.photo_batches FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX photo_batches_sort_key_idx ON public.photo_batches (sort_key DESC);
CREATE INDEX photo_batches_rego_idx ON public.photo_batches (rego);
CREATE INDEX photo_batches_reservation_idx ON public.photo_batches (reservation_no);

CREATE TRIGGER update_photo_batches_updated_at
  BEFORE UPDATE ON public.photo_batches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
