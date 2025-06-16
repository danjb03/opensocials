
-- Add the missing updated_at column to creator_public_analytics table
ALTER TABLE public.creator_public_analytics 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL;

-- Update the existing trigger to properly handle the updated_at column
-- (The trigger function already exists and expects this column)
