ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS has_seen_creator_intro boolean DEFAULT false;
