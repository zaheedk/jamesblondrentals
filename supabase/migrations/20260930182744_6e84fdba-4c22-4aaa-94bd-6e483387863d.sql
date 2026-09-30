CREATE TABLE public.agent_brokers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  api_key text NOT NULL UNIQUE,
  shared_secret text NOT NULL,
  rcm_credential_ref text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  rate_limit_per_min integer NOT NULL DEFAULT 120,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.agent_brokers TO service_role;
ALTER TABLE public.agent_brokers ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.agent_api_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id uuid REFERENCES public.agent_brokers(id) ON DELETE SET NULL,
  api_key_prefix text,
  method text,
  status text NOT NULL,
  error text,
  duration_ms integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX agent_api_log_broker_time ON public.agent_api_log(broker_id, created_at DESC);
GRANT SELECT ON public.agent_api_log TO authenticated;
GRANT ALL ON public.agent_api_log TO service_role;
ALTER TABLE public.agent_api_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read broker API log" ON public.agent_api_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_agent_brokers_updated_at BEFORE UPDATE ON public.agent_brokers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();