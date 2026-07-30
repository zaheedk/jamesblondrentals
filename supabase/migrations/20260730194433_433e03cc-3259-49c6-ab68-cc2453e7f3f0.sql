CREATE TABLE public.vehicle_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL,
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX vehicle_categories_code_key ON public.vehicle_categories (upper(code));

GRANT SELECT ON public.vehicle_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vehicle_categories TO authenticated;
GRANT ALL ON public.vehicle_categories TO service_role;

ALTER TABLE public.vehicle_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vehicle categories"
  ON public.vehicle_categories FOR SELECT USING (true);
CREATE POLICY "Staff can manage vehicle categories"
  ON public.vehicle_categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE TRIGGER update_vehicle_categories_updated_at
  BEFORE UPDATE ON public.vehicle_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.branches (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL,
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX branches_code_key ON public.branches (upper(code));

GRANT SELECT ON public.branches TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.branches TO authenticated;
GRANT ALL ON public.branches TO service_role;

ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view branches"
  ON public.branches FOR SELECT USING (true);
CREATE POLICY "Staff can manage branches"
  ON public.branches FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE TRIGGER update_branches_updated_at
  BEFORE UPDATE ON public.branches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();