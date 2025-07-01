-- Migration: Social Media Integration with Apify
-- Description: Adds tables for social media integration with Apify scrapers
-- Date: 2025-06-25

-- Enable RLS for all tables
ALTER DATABASE postgres SET "app.enable_rls" TO true;

-- Create enum for social platforms
CREATE TYPE social_platform_type AS ENUM ('instagram', 'tiktok', 'youtube', 'linkedin');

-- Create enum for job statuses
CREATE TYPE social_job_status AS ENUM ('pending', 'running', 'succeeded', 'failed', 'timed_out', 'aborted');

-- Table: creators_social_accounts
-- Purpose: Links creators to their social media accounts
CREATE TABLE creators_social_accounts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform        social_platform_type NOT NULL,
  handle          TEXT NOT NULL,
  -- Stores one or more Apify actor slugs. Single-scraper platforms keep a single
  -- string, dual-scraper platforms keep:  {"primary": "...", "secondary": "..."}
  actor_id        JSONB NOT NULL,
  last_run        TIMESTAMPTZ,
  next_run        TIMESTAMPTZ,
  status          TEXT DEFAULT 'pending', -- pending, running, failed, ready
  error           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  
  -- Ensure one platform per creator
  UNIQUE (creator_id, platform)
);

-- Table: social_jobs
-- Purpose: Tracks Apify scraping jobs
CREATE TABLE social_jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id      UUID NOT NULL REFERENCES creators_social_accounts(id) ON DELETE CASCADE,
  apify_run_id    TEXT NOT NULL,
  -- Indicates whether this row is for the primary or secondary actor run.
  actor_type      TEXT NOT NULL CHECK (actor_type IN ('primary','secondary')),
  started_at      TIMESTAMPTZ DEFAULT now(),
  finished_at     TIMESTAMPTZ,
  status          social_job_status DEFAULT 'pending',
  log             TEXT,
  raw_response    JSONB, -- Store raw Apify response
  -- When true, both (or the only) actor runs for the parent account are finished
  all_jobs_complete BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Table: social_metrics
-- Purpose: Stores metrics data from social platforms
CREATE TABLE social_metrics (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  account_id      UUID NOT NULL REFERENCES creators_social_accounts(id) ON DELETE CASCADE,
  snapshot_ts     TIMESTAMPTZ DEFAULT now(),
  
  -- Platform presence
  profile_image   TEXT,
  username        TEXT,
  display_name    TEXT,
  account_type    TEXT, -- Business, Creator, Personal
  is_verified     BOOLEAN DEFAULT false,
  
  -- Audience size
  followers       INTEGER,
  followers_prev  INTEGER, -- Previous snapshot for growth calculation
  followers_30d_ago INTEGER, -- For 30-day growth rate
  new_followers_week INTEGER, -- Average new followers per week
  
  -- Engagement performance
  engagement_rate NUMERIC(5,2), -- Percentage (likes + comments / followers)
  views_avg       INTEGER, -- Average views per post
  likes_avg       INTEGER, -- Average likes per post
  comments_avg    INTEGER, -- Average comments per post
  peak_reach      INTEGER, -- Best reach in last 30 days
  
  -- Audience insights
  gender_male     NUMERIC(5,2), -- Percentage
  gender_female   NUMERIC(5,2), -- Percentage
  gender_other    NUMERIC(5,2), -- Percentage
  age_ranges      JSONB, -- Age distribution
  top_countries   JSONB, -- Country distribution
  top_cities      JSONB, -- City distribution
  languages       JSONB, -- Language distribution
  active_hours    JSONB, -- When audience is most active
  
  -- Posting frequency & recency
  posts_per_week  NUMERIC(5,2), -- Average
  last_post_date  DATE,
  posts_30d       INTEGER, -- Posts in last 30 days
  inactivity_days INTEGER, -- Days since last post
  
  -- Metadata
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_social_metrics_account_id ON social_metrics(account_id);
CREATE INDEX idx_social_metrics_snapshot_ts ON social_metrics(snapshot_ts);

-- Table: admin_operations
-- Purpose: Logs admin-level actions
CREATE TABLE admin_operations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation       TEXT NOT NULL, -- e.g., 'refresh_all_social_accounts'
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  timestamp       TIMESTAMPTZ DEFAULT now(),
  metadata        JSONB -- Additional details about the operation
);

-- View: v_creator_social_overview
-- Purpose: Convenience view for UI to show latest metrics for each creator's social account
CREATE OR REPLACE VIEW v_creator_social_overview AS
SELECT
  a.creator_id,
  a.platform,
  a.handle,
  a.status,
  a.last_run,
  a.next_run,
  m.profile_image,
  m.username,
  m.display_name,
  m.account_type,
  m.is_verified,
  m.followers,
  m.followers_prev,
  m.followers_30d_ago,
  m.new_followers_week,
  m.engagement_rate,
  m.views_avg,
  m.likes_avg,
  m.comments_avg,
  m.peak_reach,
  m.gender_male,
  m.gender_female,
  m.gender_other,
  m.age_ranges,
  m.top_countries,
  m.top_cities,
  m.languages,
  m.active_hours,
  m.posts_per_week,
  m.last_post_date,
  m.posts_30d,
  m.inactivity_days,
  m.created_at AS metric_created_at,
  m.snapshot_ts
FROM creators_social_accounts a
JOIN LATERAL (
  SELECT 
    *
  FROM social_metrics m
  WHERE m.account_id = a.id
  ORDER BY snapshot_ts DESC
  LIMIT 1
) m ON true;

-- Function: refresh_social_metrics
-- Purpose: Trigger Apify runs for accounts due for refresh (deprecated in favor of Edge Function)
CREATE OR REPLACE FUNCTION refresh_social_metrics() RETURNS void AS $$
BEGIN
  UPDATE creators_social_accounts
  SET next_run = now() + CASE 
      WHEN platform = 'instagram' THEN interval '12 hours' 
      ELSE interval '24 hours' 
    END
  WHERE next_run IS NULL
     OR next_run < now();
END;
$$ LANGUAGE plpgsql;

-- Create RLS policies
ALTER TABLE creators_social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_operations ENABLE ROW LEVEL SECURITY;

-- Creators can view their own social accounts
CREATE POLICY creators_view_own_accounts ON creators_social_accounts
  FOR SELECT
  USING (auth.uid() = creator_id);

-- Creators can view their own social metrics
CREATE POLICY creators_view_own_metrics ON social_metrics
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM creators_social_accounts 
    WHERE creators_social_accounts.id = social_metrics.account_id
    AND creators_social_accounts.creator_id = auth.uid()
  ));

-- Creators can insert/update their own social accounts
CREATE POLICY creators_manage_own_accounts ON creators_social_accounts
  FOR ALL
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Creators can insert their own social jobs (via edge function)
CREATE POLICY creators_insert_own_jobs ON social_jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM creators_social_accounts
    WHERE creators_social_accounts.id = social_jobs.account_id
    AND creators_social_accounts.creator_id = auth.uid()
  ));

-- Admins can view all social data
CREATE POLICY admins_view_all_accounts ON creators_social_accounts
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role IN ('admin', 'super_admin')
    AND user_roles.status = 'approved'
  ));

CREATE POLICY admins_view_all_jobs ON social_jobs
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role IN ('admin', 'super_admin')
    AND user_roles.status = 'approved'
  ));

CREATE POLICY admins_view_all_metrics ON social_metrics
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role IN ('admin', 'super_admin')
    AND user_roles.status = 'approved'
  ));

CREATE POLICY admins_manage_admin_operations ON admin_operations
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role IN ('admin', 'super_admin')
    AND user_roles.status = 'approved'
  ));

-- Add comment for documentation
COMMENT ON TABLE creators_social_accounts IS 'Links creators to their social media accounts for Apify integration';
COMMENT ON TABLE social_jobs IS 'Tracks Apify scraping jobs for social media data';
COMMENT ON TABLE social_metrics IS 'Stores metrics data from social platforms via Apify scrapers';
COMMENT ON TABLE admin_operations IS 'Logs admin-level operations within the application';
COMMENT ON VIEW v_creator_social_overview IS 'Latest social metrics for each creator''s social accounts';
