CREATE TABLE public.visitor_posts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), display_name text NOT NULL, message text NOT NULL, photo_path text, created_at timestamptz NOT NULL DEFAULT now(), hidden boolean NOT NULL DEFAULT false, CONSTRAINT visitor_name_length CHECK (char_length(display_name) BETWEEN 1 AND 40), CONSTRAINT visitor_message_length CHECK (char_length(message) BETWEEN 1 AND 240));
GRANT SELECT ON public.visitor_posts TO anon, authenticated;
GRANT ALL ON public.visitor_posts TO service_role;
ALTER TABLE public.visitor_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public visible visits" ON public.visitor_posts FOR SELECT TO anon, authenticated USING (NOT hidden);
COMMENT ON TABLE public.visitor_posts IS 'Public visitor guestbook. Writes and moderation are service-role-only through validated edge functions.';
CREATE TABLE public.visitor_reports (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), post_id uuid NOT NULL REFERENCES public.visitor_posts(id) ON DELETE CASCADE, reason text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.visitor_reports TO service_role;
ALTER TABLE public.visitor_reports ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.visitor_reports IS 'Service-role-only abuse reports. Never expose reporters or report contents publicly.';
CREATE TABLE public.visitor_limits (key text PRIMARY KEY, last_called_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.visitor_limits TO service_role;
ALTER TABLE public.visitor_limits ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.visitor_limits IS 'Service-role-only hashed network rate-limit keys, no raw IP storage.';
CREATE FUNCTION public.claim_visitor_request(request_key text) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE claimed text;
BEGIN
INSERT INTO public.visitor_limits(key, last_called_at) VALUES (request_key, now()) ON CONFLICT (key) DO UPDATE SET last_called_at = now() WHERE visitor_limits.last_called_at <= now() - interval '1 minute' RETURNING key INTO claimed;
RETURN claimed IS NOT NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_visitor_request(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_visitor_request(text) TO service_role;