CREATE TABLE public.product_challenge_limits (request_key text PRIMARY KEY, last_called_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.product_challenge_limits TO service_role;
ALTER TABLE public.product_challenge_limits ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.product_challenge_limits IS 'Service-role-only hashed network throttle for anonymous AI requests; no raw IP or challenge content.';
CREATE TABLE public.product_challenge_ai_state (id text PRIMARY KEY, status integer NOT NULL, message text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.product_challenge_ai_state TO service_role;
ALTER TABLE public.product_challenge_ai_state ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.product_challenge_ai_state IS 'Service-role-only persistent AI pause state. Owner must explicitly clear after access or billing recovery.';
CREATE FUNCTION public.claim_product_challenge(request_key text) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE claimed text;
BEGIN
 INSERT INTO public.product_challenge_limits AS limits (request_key, last_called_at) VALUES (request_key, now())
 ON CONFLICT ON CONSTRAINT product_challenge_limits_pkey DO UPDATE SET last_called_at = now() WHERE limits.last_called_at <= now() - interval '60 seconds'
 RETURNING limits.request_key INTO claimed;
 RETURN claimed IS NOT NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_product_challenge(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_product_challenge(text) TO service_role;