-- Migration: Social Media Integration with Apify
-- Description: Adds tables for social media integration, job tracking, and standardized metrics storage.
-- Date: 2025-06-25

-- Enable RLS for all tables if not already enabled
ALTER DATABASE postgres SET "app.enable_rls" TO true;

-- Create enum types for consistency
CREATE TYPE social_platform_type AS ENUM ('instagram', 'tiktok', 'youtube', 'linkedin', 'twitter');
CREATE TYPE social_job_status AS ENUM ('pending', 'running', 'succeeded', 'failed', 'timed_out', 'aborted');

-- Table: creators_social_accounts
-- Purpose: Links creator profiles to their social media handles and the Apify actors used to scrape them.
CREATE TABLE creators_social_accounts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform        social_platform_type NOT NULL,
  handle          TEXT NOT NULL,
  -- Stores Apify actor slugs. Can be a string for single-actor platforms or JSON for dual-actor platforms.
  -- e.g., "apify/instagram-profile-scraper" OR {"primary": "apify/tiktok-scraper", "secondary": "..."}
  actor_id        JSONB NOT NULL,
  last_run        TIMESTAMPTZ,
  next_run        TIMESTAMPTZ,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'failed', 'ready')),
  error           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  
  -- A creator can only have one account per platform.
  UNIQUE (creator_id, platform)
);
COMMENT ON TABLE creators_social_accounts IS 'Links creators to their social media accounts and associated Apify actors.';

-- Table: social_jobs
-- Purpose: Tracks individual Apify actor runs for auditing and debugging.
CREATE TABLE social_jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id      UUID NOT NULL REFERENCES creators_social_accounts(id) ON DELETE CASCADE,
  apify_run_id    TEXT NOT NULL,
  -- For dual-actor platforms, this specifies if it's the 'primary' or 'secondary' run.
  actor_type      TEXT NOT NULL CHECK (actor_type IN ('primary','secondary')),
  started_at      TIMESTAMPTZ DEFAULT now(),
  finished_at     TIMESTAMPTZ,
  status          social_job_status DEFAULT 'pending',
  log             TEXT,
  raw_response    JSONB, -- Stores the raw JSON response from Apify for debugging.
  -- Flag to indicate when all jobs for a given account refresh cycle are complete.
  all_jobs_complete BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE social_jobs IS 'Tracks Apify scraping jobs for social media data collection.';

-- Table: social_metrics
-- Purpose: The single source of truth for all normalized social media metrics.
CREATE TABLE social_metrics (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform          social_platform_type NOT NULL,
  
  -- Universal Data Points
  username            TEXT NOT NULL,
  profile_url         TEXT,
  profile_picture_url TEXT,
  followers_count     INTEGER,
  following_count     INTEGER,
  bio                 TEXT,
  location            TEXT,
  engagement_rate     NUMERIC(5, 2),
  post_frequency      NUMERIC(5, 2), -- e.g., posts per week
  is_verified         BOOLEAN DEFAULT FALSE,
  account_type        TEXT, -- e.g., 'business', 'creator', 'personal'
  
  -- Platform-Specific Metrics (as JSONB for flexibility)
  -- This will hold fields like avg_likes, avg_comments, total_views, etc.
  platform_data       JSONB,
  
  -- Timestamps
  snapshot_ts         TIMESTAMPTZ DEFAULT now(), -- When this snapshot was taken.
  last_updated_at     TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE social_metrics IS 'Stores normalized metrics from all social platforms.';

-- Table: admin_operations
-- Purpose: Logs admin-level actions for auditing, e.g., "refresh all accounts".
CREATE TABLE admin_operations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation       TEXT NOT NULL,
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  timestamp       TIMESTAMPTZ DEFAULT now(),
  metadata        JSONB -- e.g., { "batchSize": 50, "force": true }
);
COMMENT ON TABLE admin_operations IS 'Logs administrative actions within the application.';

-- Indexes for performance
CREATE INDEX idx_social_metrics_creator_id_platform ON social_metrics(creator_id, platform);
CREATE INDEX idx_social_metrics_snapshot_ts ON social_metrics(snapshot_ts);
CREATE INDEX idx_social_jobs_account_id ON social_jobs(account_id);

-- View: v_creator_social_overview
-- Purpose: Simplifies frontend queries by providing the latest metrics for each account.
CREATE OR REPLACE VIEW v_creator_social_overview AS
SELECT
  a.id AS account_id,
  a.creator_id,
  a.platform,
  a.handle,
  a.status,
  a.last_run,
  a.next_run,
  m.profile_picture_url,
  m.username,
  m.bio,
  m.followers_count,
  m.engagement_rate,
  m.platform_data->>'avg_likes' AS avg_likes,
  m.platform_data->>'avg_comments' AS avg_comments,
  m.platform_data->>'avg_views' AS avg_views,
  m.is_verified,
  m.snapshot_ts AS metric_last_updated
FROM creators_social_accounts a
LEFT JOIN LATERAL (
  SELECT *
  FROM social_metrics m
  WHERE m.creator_id = a.creator_id AND m.platform = a.platform
  ORDER BY m.snapshot_ts DESC
  LIMIT 1
) m ON true;
COMMENT ON VIEW v_creator_social_overview IS 'Provides the latest social metrics for each creator account.';

-- RLS Policies
ALTER TABLE creators_social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_operations ENABLE ROW LEVEL SECURITY;

-- Creators can manage their own social accounts
CREATE POLICY "Creators can manage their own social accounts"
ON creators_social_accounts FOR ALL
USING (auth.uid() = creator_id)
WITH CHECK (auth.uid() = creator_id);

-- Creators can view their own jobs
CREATE POLICY "Creators can view their own social jobs"
ON social_jobs FOR SELECT
USING (EXISTS (
  SELECT 1 FROM creators_social_accounts
  WHERE creators_social_accounts.id = social_jobs.account_id AND creators_social_accounts.creator_id = auth.uid()
));

-- Creators can view their own metrics
CREATE POLICY "Creators can view their own social metrics"
ON social_metrics FOR SELECT
USING (auth.uid() = creator_id);

-- Admins have full access to all social data
CREATE POLICY "Admins have full access"
ON creators_social_accounts FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'super_admin') AND user_roles.status = 'approved'
));

CREATE POLICY "Admins have full access to jobs"
ON social_jobs FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'super_admin') AND user_roles.status = 'approved'
));

CREATE POLICY "Admins have full access to metrics"
ON social_metrics FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'super_admin') AND user_roles.status = 'approved'
));

CREATE POLICY "Admins can manage admin operations"
ON admin_operations FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'super_admin') AND user_roles.status = 'approved'
));
