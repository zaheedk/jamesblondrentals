ALTER TABLE public.quote_reminder_log
  ADD COLUMN IF NOT EXISTS opened_at timestamptz,
  ADD COLUMN IF NOT EXISTS open_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS clicked_at timestamptz,
  ADD COLUMN IF NOT EXISTS click_count integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.track_quote_reminder(_id uuid, _event text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path TO 'public' AS $$
  UPDATE public.quote_reminder_log SET
    opened_at = CASE WHEN _event IN ('open','click') THEN COALESCE(opened_at, now()) ELSE opened_at END,
    open_count = open_count + CASE WHEN _event = 'open' THEN 1 ELSE 0 END,
    clicked_at = CASE WHEN _event = 'click' THEN COALESCE(clicked_at, now()) ELSE clicked_at END,
    click_count = click_count + CASE WHEN _event = 'click' THEN 1 ELSE 0 END
  WHERE id = _id;
$$;
REVOKE ALL ON FUNCTION public.track_quote_reminder(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_quote_reminder(uuid, text) TO service_role;