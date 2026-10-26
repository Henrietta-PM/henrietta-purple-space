ALTER TABLE public.visitor_posts DROP CONSTRAINT visitor_message_length;
ALTER TABLE public.visitor_posts ALTER COLUMN message SET DEFAULT '';
ALTER TABLE public.visitor_posts ADD CONSTRAINT visitor_message_length CHECK (char_length(message) <= 240 AND (char_length(message) >= 1 OR photo_path IS NOT NULL));