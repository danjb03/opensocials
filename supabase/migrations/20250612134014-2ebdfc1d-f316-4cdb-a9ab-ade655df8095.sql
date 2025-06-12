
-- Add creator_tier column to profiles table
ALTER TABLE profiles 
ADD COLUMN creator_tier TEXT CHECK (creator_tier IN ('Nano', 'Micro', 'Mid', 'Macro', 'Large', 'Celebrity')) DEFAULT 'Nano';

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_creator_tier ON profiles(creator_tier);

-- Add comment
COMMENT ON COLUMN profiles.creator_tier IS 'Creator tier for pricing validation (Nano, Micro, Mid, Macro, Large, Celebrity)';
