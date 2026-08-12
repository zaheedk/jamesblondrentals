CREATE TYPE public.document_type AS ENUM ('licence_front', 'licence_back', 'passport', 'proof_of_address');
CREATE TYPE public.document_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.customer_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  doc_type public.document_type NOT NULL,
  file_path text NOT NULL,
  file_name text,
  status public.document_status NOT NULL DEFAULT 'pending',
  review_notes text,
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  licence_expiry date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX customer_documents_user_type_idx ON public.customer_documents (user_id, doc_type);
CREATE INDEX customer_documents_status_idx ON public.customer_documents (status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_documents TO authenticated;
GRANT ALL ON public.customer_documents TO service_role;

ALTER TABLE public.customer_documents ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.customer_has_booking(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.bookings b WHERE b.user_id = _user_id);
$$;

CREATE POLICY "Users can view their own documents"
ON public.customer_documents FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own documents"
ON public.customer_documents FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Users can update their own pending documents"
ON public.customer_documents FOR UPDATE TO authenticated
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Users can delete their own pending documents"
ON public.customer_documents FOR DELETE TO authenticated
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can view documents of booked customers"
ON public.customer_documents FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') AND public.customer_has_booking(user_id));

CREATE POLICY "Admins can review documents of booked customers"
ON public.customer_documents FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin') AND public.customer_has_booking(user_id))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_customer_documents_updated_at
BEFORE UPDATE ON public.customer_documents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policies: files live under <user_id>/...
CREATE POLICY "Users can read own customer documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'customer-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own customer documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'customer-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own customer documents"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'customer-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own customer documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'customer-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can read booked customer documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'customer-documents'
  AND public.has_role(auth.uid(), 'admin')
  AND public.customer_has_booking(((storage.foldername(name))[1])::uuid)
);