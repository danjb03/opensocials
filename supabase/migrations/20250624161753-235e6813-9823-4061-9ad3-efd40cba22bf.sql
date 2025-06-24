
-- Add social_urls column to brand_profiles table
ALTER TABLE brand_profiles 
ADD COLUMN IF NOT EXISTS social_urls jsonb DEFAULT '{
  "instagram": null,
  "tiktok": null,
  "youtube": null,
  "linkedin": null,
  "twitter": null
}'::jsonb;
