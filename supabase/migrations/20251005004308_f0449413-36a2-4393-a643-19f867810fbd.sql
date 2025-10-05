-- Create hearts table to track heart submissions
CREATE TABLE IF NOT EXISTS public.hearts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.hearts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view heart count
CREATE POLICY "Anyone can view hearts"
ON public.hearts
FOR SELECT
USING (true);

-- Allow anyone to insert hearts
CREATE POLICY "Anyone can send hearts"
ON public.hearts
FOR INSERT
WITH CHECK (true);

-- Enable realtime for hearts table
ALTER TABLE public.hearts REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.hearts;