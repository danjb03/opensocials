
-- Create the creator_public_analytics table with exact field names matching InsightIQ schema
CREATE TABLE IF NOT EXISTS public.creator_public_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform text NOT NULL,
  work_platform_id uuid NULL,
  identifier text NOT NULL,
  fetched_at timestamp with time zone NOT NULL DEFAULT now(),
  profile_url text NULL,
  image_url text NULL,
  full_name text NULL,
  is_verified boolean NULL,
  follower_count integer NULL,
  engagement_rate double precision NULL,
  platform_account_type text NULL,
  introduction text NULL,
  gender text NULL,
  age_group text NULL,
  language text NULL,
  content_count integer NULL,
  average_likes integer NULL,
  average_comments integer NULL,
  average_views integer NULL,
  average_reels_views integer NULL,
  sponsored_posts_performance double precision NULL,
  credibility_score double precision NULL,
  top_contents jsonb NULL,
  recent_contents jsonb NULL,
  sponsored_contents jsonb NULL,
  top_hashtags jsonb NULL,
  top_mentions jsonb NULL,
  top_interests jsonb NULL,
  brand_affinity jsonb NULL,
  audience jsonb NULL,
  pricing jsonb NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create unique constraint on creator_id + platform
CREATE UNIQUE INDEX IF NOT EXISTS creator_public_analytics_creator_platform_idx 
ON public.creator_public_analytics (creator_id, platform);

-- Enable RLS
ALTER TABLE public.creator_public_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for creator_public_analytics
CREATE POLICY "Users can view their own analytics" 
  ON public.creator_public_analytics 
  FOR SELECT 
  USING (auth.uid() = creator_id);

CREATE POLICY "Users can insert their own analytics" 
  ON public.creator_public_analytics 
  FOR INSERT 
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own analytics" 
  ON public.creator_public_analytics 
  FOR UPDATE 
  USING (auth.uid() = creator_id);

-- Allow brands/admins to view creator analytics
CREATE POLICY "Brands can view creator analytics" 
  ON public.creator_public_analytics 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('brand', 'admin', 'agency')
      AND status = 'approved'
    )
  );

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_creator_public_analytics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER creator_public_analytics_updated_at
  BEFORE UPDATE ON public.creator_public_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_creator_public_analytics_updated_at();
