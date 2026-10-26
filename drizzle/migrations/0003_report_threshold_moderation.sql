ALTER TABLE public.visitor_reports ADD COLUMN IF NOT EXISTS reporter_hash text;
CREATE UNIQUE INDEX IF NOT EXISTS visitor_reports_post_reporter_uniq ON public.visitor_reports (post_id, reporter_hash);

-- Service-role only: one-time moderation tokens emailed to the owner. No anon/authenticated access.
CREATE TABLE public.visitor_moderation (
  post_id uuid PRIMARY KEY,
  token uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);
GRANT ALL ON public.visitor_moderation TO service_role;
ALTER TABLE public.visitor_moderation ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.visitor_moderation IS 'Service-role only: moderation tokens for auto-hidden visitor posts.';

-- Atomically records a report from a distinct visitor and auto-hides the post at the threshold.
-- Returns a token only on the report that crosses the threshold, so the owner is emailed once.
CREATE OR REPLACE FUNCTION public.record_visitor_report(_post_id uuid, _reason text, _reporter_hash text, _threshold int DEFAULT 3)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inserted int;
  total int;
  new_token uuid;
BEGIN
  PERFORM 1 FROM visitor_posts WHERE id = _post_id FOR UPDATE;
  IF NOT FOUND THEN RETURN NULL; END IF;
  INSERT INTO visitor_reports (post_id, reason, reporter_hash) VALUES (_post_id, _reason, _reporter_hash)
  ON CONFLICT (post_id, reporter_hash) DO NOTHING;
  GET DIAGNOSTICS inserted = ROW_COUNT;
  IF inserted = 0 THEN RETURN NULL; END IF;
  SELECT count(DISTINCT reporter_hash) INTO total FROM visitor_reports WHERE post_id = _post_id AND reporter_hash IS NOT NULL;
  IF total <> _threshold THEN RETURN NULL; END IF;
  UPDATE visitor_posts SET hidden = true WHERE id = _post_id;
  INSERT INTO visitor_moderation (post_id) VALUES (_post_id)
  ON CONFLICT (post_id) DO UPDATE SET token = gen_random_uuid(), resolved_at = NULL, created_at = now()
  RETURNING token INTO new_token;
  RETURN new_token;
END;
$$;
REVOKE ALL ON FUNCTION public.record_visitor_report(uuid, text, text, int) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_visitor_report(uuid, text, text, int) TO service_role;