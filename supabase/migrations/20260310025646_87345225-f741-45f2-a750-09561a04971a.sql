
-- Drop existing overly permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can send hearts" ON public.hearts;

-- Create a rate-limited INSERT policy: max 1 heart per 60 seconds globally (anonymous)
-- Since there's no auth, we use a simple time-based check on recent inserts
CREATE POLICY "Rate limited heart inserts"
ON public.hearts
FOR INSERT
TO public
WITH CHECK (
  NOT EXISTS (
    SELECT 1 FROM public.hearts
    WHERE created_at > (now() - interval '60 seconds')
  )
);
