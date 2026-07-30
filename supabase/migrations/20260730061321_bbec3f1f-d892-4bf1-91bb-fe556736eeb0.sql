CREATE TABLE public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rego text NOT NULL,
  make text,
  model text,
  year integer,
  category text,
  branch text,
  active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX vehicles_rego_unique_idx ON public.vehicles (upper(rego));
CREATE INDEX vehicles_active_idx ON public.vehicles (active);
CREATE INDEX vehicles_category_idx ON public.vehicles (category);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vehicles TO authenticated;
GRANT ALL ON public.vehicles TO service_role;

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view vehicles" ON public.vehicles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Staff can insert vehicles" ON public.vehicles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Staff can update vehicles" ON public.vehicles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Admins can delete vehicles" ON public.vehicles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.vehicle_groom_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  vehicle_rego text NOT NULL,
  checked_at timestamptz NOT NULL DEFAULT now(),
  checked_by_user_id uuid,
  checked_by_name text NOT NULL,
  items jsonb NOT NULL DEFAULT '{}'::jsonb,
  issues_found boolean NOT NULL DEFAULT false,
  odometer integer,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX vgc_vehicle_id_idx ON public.vehicle_groom_checklists (vehicle_id);
CREATE INDEX vgc_checked_at_idx ON public.vehicle_groom_checklists (checked_at DESC);
CREATE INDEX vgc_rego_idx ON public.vehicle_groom_checklists (upper(vehicle_rego));
CREATE INDEX vgc_issues_idx ON public.vehicle_groom_checklists (issues_found);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vehicle_groom_checklists TO authenticated;
GRANT ALL ON public.vehicle_groom_checklists TO service_role;

ALTER TABLE public.vehicle_groom_checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view checklists" ON public.vehicle_groom_checklists
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Staff can insert checklists" ON public.vehicle_groom_checklists
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Staff can update checklists" ON public.vehicle_groom_checklists
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Admins can delete checklists" ON public.vehicle_groom_checklists
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_vgc_updated_at
  BEFORE UPDATE ON public.vehicle_groom_checklists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();