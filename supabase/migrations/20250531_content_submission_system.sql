-- Content Submission and Campaign Proof-Tracking System
-- Production-ready backend logic for creator-brand campaign platform

-- Drop existing tables if they exist to avoid conflicts
DROP TABLE IF EXISTS proof_log CASCADE;
DROP TABLE IF EXISTS upload_reviews CASCADE;
DROP TABLE IF EXISTS upload_deliverables CASCADE;
DROP TABLE IF EXISTS uploads CASCADE;
DROP TABLE IF EXISTS campaign_briefs CASCADE;

-- Campaign Briefs Table
-- Links campaigns to specific content requirements/briefs
CREATE TABLE campaign_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES projects_new(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  requirements JSONB NOT NULL DEFAULT '{}',
  deliverables JSONB NOT NULL DEFAULT '{}',
  submission_deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Create indexes for performance
CREATE INDEX idx_campaign_briefs_campaign_id ON campaign_briefs(campaign_id);
CREATE INDEX idx_campaign_briefs_deadline ON campaign_briefs(submission_deadline);

-- Uploads Table
-- Core content submission tracking
CREATE TABLE uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES projects_new(id) ON DELETE CASCADE,
  brief_id UUID NOT NULL REFERENCES campaign_briefs(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size BIGINT,
  thumbnail_url TEXT,
  content_type VARCHAR(50) NOT NULL, -- 'video', 'image', 'story', 'post'
  platform VARCHAR(50) NOT NULL, -- 'instagram', 'tiktok', 'youtube'
  title VARCHAR(255),
  description TEXT,
  tags TEXT[],
  status VARCHAR(50) NOT NULL DEFAULT 'pending_review', -- 'pending_review', 'approved', 'rejected', 'revision_requested'
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for uploads
CREATE INDEX idx_uploads_campaign_id ON uploads(campaign_id);
CREATE INDEX idx_uploads_brief_id ON uploads(brief_id);
CREATE INDEX idx_uploads_creator_id ON uploads(creator_id);
CREATE INDEX idx_uploads_status ON uploads(status);
CREATE INDEX idx_uploads_submitted_at ON uploads(submitted_at);

-- Upload Deliverables Junction Table
-- Links uploads to specific deliverable requirements
CREATE TABLE upload_deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id UUID NOT NULL REFERENCES uploads(id) ON DELETE CASCADE,
  deliverable_type VARCHAR(100) NOT NULL, -- 'story', 'post', 'reel', 'video'
  deliverable_spec JSONB NOT NULL DEFAULT '{}', -- specific requirements for this deliverable
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_upload_deliverables_upload_id ON upload_deliverables(upload_id);

-- Upload Reviews Table
-- Track all review actions, comments, and feedback
CREATE TABLE upload_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id UUID NOT NULL REFERENCES uploads(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id),
  action VARCHAR(50) NOT NULL, -- 'approve', 'reject', 'request_revision'
  comments TEXT,
  feedback_data JSONB DEFAULT '{}',
  reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_upload_reviews_upload_id ON upload_reviews(upload_id);
CREATE INDEX idx_upload_reviews_reviewer_id ON upload_reviews(reviewer_id);

-- Proof Log Table
-- Track when and where content was actually posted live
CREATE TABLE proof_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id UUID NOT NULL REFERENCES uploads(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES projects_new(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  proof_url TEXT NOT NULL,
  platform VARCHAR(50) NOT NULL,
  post_type VARCHAR(50) NOT NULL, -- 'story', 'post', 'reel', 'video'
  posted_at TIMESTAMPTZ NOT NULL,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  detection_method VARCHAR(50) DEFAULT 'manual', -- 'manual', 'ai_detected', 'api_webhook'
  metrics JSONB DEFAULT '{}', -- likes, comments, views, shares, etc.
  is_live BOOLEAN DEFAULT TRUE,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for proof_log
CREATE INDEX idx_proof_log_upload_id ON proof_log(upload_id);
CREATE INDEX idx_proof_log_campaign_id ON proof_log(campaign_id);
CREATE INDEX idx_proof_log_creator_id ON proof_log(creator_id);
CREATE INDEX idx_proof_log_posted_at ON proof_log(posted_at);
CREATE INDEX idx_proof_log_platform ON proof_log(platform);

-- Campaign Analytics Summary Table
-- Aggregated campaign performance data
CREATE TABLE campaign_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES projects_new(id) ON DELETE CASCADE,
  total_uploads INTEGER DEFAULT 0,
  approved_uploads INTEGER DEFAULT 0,
  rejected_uploads INTEGER DEFAULT 0,
  live_posts INTEGER DEFAULT 0,
  total_creators INTEGER DEFAULT 0,
  total_reach BIGINT DEFAULT 0,
  total_engagement BIGINT DEFAULT 0,
  avg_engagement_rate DECIMAL(5,4) DEFAULT 0,
  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_campaign_analytics_campaign_id ON campaign_analytics(campaign_id);

-- Notification Queue Table
-- Queue system for sending notifications
CREATE TABLE notification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  notification_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  priority INTEGER DEFAULT 5, -- 1 = highest, 10 = lowest
  scheduled_for TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notification_queue_user_id ON notification_queue(user_id);
CREATE INDEX idx_notification_queue_status ON notification_queue(status);
CREATE INDEX idx_notification_queue_scheduled_for ON notification_queue(scheduled_for);

-- Enable RLS on all tables
ALTER TABLE campaign_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE proof_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Campaign Briefs: Brands can manage their campaigns, creators can view briefs for their assigned campaigns
CREATE POLICY "campaign_briefs_brand_access" ON campaign_briefs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects_new p
      JOIN brand_profiles bp ON p.brand_id = bp.user_id
      WHERE p.id = campaign_briefs.campaign_id
      AND bp.user_id = auth.uid()
    )
  );

CREATE POLICY "campaign_briefs_creator_view" ON campaign_briefs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM project_creators pc
      WHERE pc.project_id = campaign_briefs.campaign_id
      AND pc.creator_id = auth.uid()
    )
  );

-- Uploads: Creators can manage their own uploads, brands can view uploads for their campaigns
CREATE POLICY "uploads_creator_access" ON uploads
  FOR ALL USING (creator_id = auth.uid());

CREATE POLICY "uploads_brand_view" ON uploads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects_new p
      JOIN brand_profiles bp ON p.brand_id = bp.user_id
      WHERE p.id = uploads.campaign_id
      AND bp.user_id = auth.uid()
    )
  );

-- Upload Reviews: Brands can review uploads for their campaigns
CREATE POLICY "upload_reviews_brand_access" ON upload_reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM uploads u
      JOIN projects_new p ON u.campaign_id = p.id
      JOIN brand_profiles bp ON p.brand_id = bp.user_id
      WHERE u.id = upload_reviews.upload_id
      AND bp.user_id = auth.uid()
    )
  );

-- Proof Log: Creators can add proof for their uploads, brands can view proof for their campaigns
CREATE POLICY "proof_log_creator_insert" ON proof_log
  FOR INSERT WITH CHECK (creator_id = auth.uid());

CREATE POLICY "proof_log_view_access" ON proof_log
  FOR SELECT USING (
    creator_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM projects_new p
      JOIN brand_profiles bp ON p.brand_id = bp.user_id
      WHERE p.id = proof_log.campaign_id
      AND bp.user_id = auth.uid()
    )
  );

-- Notification Queue: Users can only view their own notifications
CREATE POLICY "notification_queue_user_access" ON notification_queue
  FOR ALL USING (user_id = auth.uid());

-- TRIGGERS

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to relevant tables
CREATE TRIGGER update_campaign_briefs_updated_at BEFORE UPDATE ON campaign_briefs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_uploads_updated_at BEFORE UPDATE ON uploads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proof_log_updated_at BEFORE UPDATE ON proof_log
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_analytics_updated_at BEFORE UPDATE ON campaign_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Notification trigger when upload is submitted
CREATE OR REPLACE FUNCTION notify_brand_on_upload()
RETURNS TRIGGER AS $$
DECLARE
  brand_user_id UUID;
  campaign_name TEXT;
  creator_name TEXT;
BEGIN
  -- Get brand user ID and campaign name
  SELECT p.brand_id, p.name INTO brand_user_id, campaign_name
  FROM projects_new p
  WHERE p.id = NEW.campaign_id;

  -- Get creator name
  SELECT pr.full_name INTO creator_name
  FROM profiles pr
  WHERE pr.id = NEW.creator_id;

  -- Queue notification for brand
  INSERT INTO notification_queue (user_id, notification_type, title, message, metadata, priority)
  VALUES (
    brand_user_id,
    'upload_submitted',
    'New Content Submission',
    creator_name || ' submitted content for ' || campaign_name,
    jsonb_build_object(
      'upload_id', NEW.id,
      'campaign_id', NEW.campaign_id,
      'creator_id', NEW.creator_id,
      'creator_name', creator_name,
      'campaign_name', campaign_name,
      'content_type', NEW.content_type,
      'platform', NEW.platform
    ),
    3
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_brand_on_upload
  AFTER INSERT ON uploads
  FOR EACH ROW EXECUTE FUNCTION notify_brand_on_upload();

-- Notification trigger when upload is reviewed
CREATE OR REPLACE FUNCTION notify_creator_on_review()
RETURNS TRIGGER AS $$
DECLARE
  creator_user_id UUID;
  campaign_name TEXT;
  notification_title TEXT;
  notification_message TEXT;
BEGIN
  -- Get creator ID and campaign name
  SELECT u.creator_id, p.name INTO creator_user_id, campaign_name
  FROM uploads u
  JOIN projects_new p ON u.campaign_id = p.id
  WHERE u.id = NEW.upload_id;

  -- Set notification based on review action
  CASE NEW.action
    WHEN 'approve' THEN
      notification_title := 'Content Approved!';
      notification_message := 'Your content for ' || campaign_name || ' has been approved. You''re good to go. POST NOW.';
    WHEN 'reject' THEN
      notification_title := 'Changes Requested';
      notification_message := 'Brand requested changes for ' || campaign_name || ': ' || COALESCE(NEW.comments, 'Please review and resubmit.');
    WHEN 'request_revision' THEN
      notification_title := 'Revision Requested';
      notification_message := 'Please make revisions to your ' || campaign_name || ' content: ' || COALESCE(NEW.comments, 'See feedback details.');
    ELSE
      RETURN NEW;
  END CASE;

  -- Queue notification for creator
  INSERT INTO notification_queue (user_id, notification_type, title, message, metadata, priority)
  VALUES (
    creator_user_id,
    'upload_reviewed',
    notification_title,
    notification_message,
    jsonb_build_object(
      'upload_id', NEW.upload_id,
      'review_id', NEW.id,
      'action', NEW.action,
      'comments', NEW.comments,
      'campaign_name', campaign_name
    ),
    2
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_creator_on_review
  AFTER INSERT ON upload_reviews
  FOR EACH ROW EXECUTE FUNCTION notify_creator_on_review();

-- Update upload status based on review
CREATE OR REPLACE FUNCTION update_upload_status_on_review()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE uploads 
  SET 
    status = CASE 
      WHEN NEW.action = 'approve' THEN 'approved'
      WHEN NEW.action = 'reject' THEN 'rejected'
      WHEN NEW.action = 'request_revision' THEN 'revision_requested'
      ELSE status
    END,
    reviewed_at = NEW.reviewed_at,
    approved_at = CASE WHEN NEW.action = 'approve' THEN NEW.reviewed_at ELSE approved_at END
  WHERE id = NEW.upload_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_upload_status_on_review
  AFTER INSERT ON upload_reviews
  FOR EACH ROW EXECUTE FUNCTION update_upload_status_on_review();

-- Notification trigger when proof is logged
CREATE OR REPLACE FUNCTION notify_brand_on_proof()
RETURNS TRIGGER AS $$
DECLARE
  brand_user_id UUID;
  campaign_name TEXT;
  creator_name TEXT;
BEGIN
  -- Get brand user ID and campaign name
  SELECT p.brand_id, p.name INTO brand_user_id, campaign_name
  FROM projects_new p
  WHERE p.id = NEW.campaign_id;

  -- Get creator name
  SELECT pr.full_name INTO creator_name
  FROM profiles pr
  WHERE pr.id = NEW.creator_id;

  -- Queue notification for brand
  INSERT INTO notification_queue (user_id, notification_type, title, message, metadata, priority)
  VALUES (
    brand_user_id,
    'campaign_live',
    'Your Campaign is Live!',
    creator_name || ' posted content for ' || campaign_name || ' - your campaign is now live!',
    jsonb_build_object(
      'proof_id', NEW.id,
      'campaign_id', NEW.campaign_id,
      'creator_id', NEW.creator_id,
      'creator_name', creator_name,
      'campaign_name', campaign_name,
      'proof_url', NEW.proof_url,
      'platform', NEW.platform,
      'posted_at', NEW.posted_at
    ),
    1
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_brand_on_proof
  AFTER INSERT ON proof_log
  FOR EACH ROW EXECUTE FUNCTION notify_brand_on_proof();

-- Update campaign analytics when proof is logged
CREATE OR REPLACE FUNCTION update_campaign_analytics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO campaign_analytics (campaign_id, live_posts, last_calculated_at)
  VALUES (NEW.campaign_id, 1, NOW())
  ON CONFLICT (campaign_id) DO UPDATE SET
    live_posts = campaign_analytics.live_posts + 1,
    last_calculated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_campaign_analytics
  AFTER INSERT ON proof_log
  FOR EACH ROW EXECUTE FUNCTION update_campaign_analytics();