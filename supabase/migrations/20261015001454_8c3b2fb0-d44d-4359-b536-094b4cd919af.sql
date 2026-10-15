CREATE TABLE public.pickup_activation_reminder_log (
  id uuid primary key default gen_random_uuid(),
  booking_reference text not null,
  customer_email text not null,
  channel text not null,
  provider_id text,
  sent_at timestamptz not null default now(),
  unique (booking_reference, channel)
);
GRANT SELECT ON public.pickup_activation_reminder_log TO authenticated;
GRANT ALL ON public.pickup_activation_reminder_log TO service_role;
ALTER TABLE public.pickup_activation_reminder_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view pickup reminder log" ON public.pickup_activation_reminder_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));