CREATE TABLE public.rate_limits (
  ip TEXT PRIMARY KEY,
  last_called_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.rate_limits TO service_role;

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;