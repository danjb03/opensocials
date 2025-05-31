-- Migration: Add Rolling Payment and Creator Acceptance Support
-- This adds the missing database structure for campaign-creator relationships

-- 1. Create project_creators junction table (campaign-creator relationships)
CREATE TABLE project_creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Invitation and acceptance tracking
  status TEXT CHECK (status IN ('invited', 'accepted', 'declined', 'contracted', 'in_progress', 'submitted', 'completed', 'cancelled')) DEFAULT 'invited',
  invitation_date TIMESTAMPTZ DEFAULT NOW(),
  response_date TIMESTAMPTZ,
  contract_signed_date TIMESTAMPTZ,
  
  -- Payment information
  agreed_amount DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  payment_structure JSONB, -- e.g., {"milestones": [{"name": "contract", "percentage": 50}, {"name": "completion", "percentage": 50}]}
  
  -- Content requirements specific to this creator
  content_requirements JSONB, -- e.g., {"videos": 2, "posts": 5, "stories": 10}
  
  -- Delivery tracking
  submitted_content_count INTEGER DEFAULT 0,
  approved_content_count INTEGER DEFAULT 0,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one creator per project
  UNIQUE(project_id, creator_id)
);

-- 2. Create project_creator_payments table (individual payment tracking)
CREATE TABLE project_creator_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_creator_id UUID REFERENCES project_creators(id) ON DELETE CASCADE,
  
  -- Payment details
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  milestone TEXT, -- 'contract_signing', 'content_submission', 'campaign_completion', etc.
  
  -- Payment status
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
  
  -- Payment provider info
  payment_method TEXT, -- 'stripe', 'paypal', 'bank_transfer', etc.
  payment_provider_id TEXT, -- External payment ID
  payment_provider_status TEXT,
  
  -- Timestamps
  scheduled_date TIMESTAMPTZ,
  processed_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create project_content table (content submissions by creators)
CREATE TABLE project_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_creator_id UUID REFERENCES project_creators(id) ON DELETE CASCADE,
  
  -- Content details
  content_type TEXT CHECK (content_type IN ('video', 'post', 'story', 'reel', 'short')),
  platform TEXT, -- 'instagram', 'tiktok', 'youtube', etc.
  title TEXT,
  description TEXT,
  
  -- File/URL information
  file_url TEXT,
  file_size INTEGER,
  file_type TEXT,
  thumbnail_url TEXT,
  
  -- Status tracking
  status TEXT CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'published', 'archived')) DEFAULT 'draft',
  
  -- Review information
  reviewer_id UUID REFERENCES profiles(id),
  review_notes TEXT,
  review_date TIMESTAMPTZ,
  
  -- Publishing information
  published_url TEXT,
  published_date TIMESTAMPTZ,
  
  -- Performance metrics (to be updated post-publication)
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Add campaign budget allocation to projects table
ALTER TABLE projects 
ADD COLUMN total_creator_budget DECIMAL(10,2),
ADD COLUMN allocated_budget DECIMAL(10,2) DEFAULT 0,
ADD COLUMN remaining_budget DECIMAL(10,2) GENERATED ALWAYS AS (total_creator_budget - allocated_budget) STORED,
ADD COLUMN allows_rolling_invitations BOOLEAN DEFAULT true,
ADD COLUMN payment_terms JSONB; -- Global payment terms for the campaign

-- 5. Create indexes for performance
CREATE INDEX idx_project_creators_project_id ON project_creators(project_id);
CREATE INDEX idx_project_creators_creator_id ON project_creators(creator_id);
CREATE INDEX idx_project_creators_status ON project_creators(status);
CREATE INDEX idx_project_creator_payments_project_creator_id ON project_creator_payments(project_creator_id);
CREATE INDEX idx_project_creator_payments_status ON project_creator_payments(status);
CREATE INDEX idx_project_content_project_creator_id ON project_content(project_creator_id);
CREATE INDEX idx_project_content_status ON project_content(status);

-- 6. Create RLS policies (Row Level Security)
ALTER TABLE project_creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_creator_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_content ENABLE ROW LEVEL SECURITY;

-- Project creators policies
CREATE POLICY "Brands can manage their project creators" ON project_creators
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.id = project_creators.project_id 
      AND p.brand_id = auth.uid()
    )
  );

CREATE POLICY "Creators can view their project assignments" ON project_creators
  FOR SELECT USING (creator_id = auth.uid());

CREATE POLICY "Creators can update their own status" ON project_creators
  FOR UPDATE USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

-- Payment policies
CREATE POLICY "Brands can manage payments for their projects" ON project_creator_payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM project_creators pc
      JOIN projects p ON p.id = pc.project_id
      WHERE pc.id = project_creator_payments.project_creator_id 
      AND p.brand_id = auth.uid()
    )
  );

CREATE POLICY "Creators can view their payments" ON project_creator_payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM project_creators pc
      WHERE pc.id = project_creator_payments.project_creator_id 
      AND pc.creator_id = auth.uid()
    )
  );

-- Content policies
CREATE POLICY "Project members can manage content" ON project_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM project_creators pc
      WHERE pc.id = project_content.project_creator_id 
      AND (
        pc.creator_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM projects p 
          WHERE p.id = pc.project_id 
          AND p.brand_id = auth.uid()
        )
      )
    )
  );

-- 7. Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_project_creators_updated_at 
  BEFORE UPDATE ON project_creators 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_creator_payments_updated_at 
  BEFORE UPDATE ON project_creator_payments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_content_updated_at 
  BEFORE UPDATE ON project_content 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Create functions for common operations

-- Function to check if project has any accepted creators
CREATE OR REPLACE FUNCTION project_has_accepted_creators(project_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM project_creators 
    WHERE project_id = project_uuid 
    AND status IN ('accepted', 'contracted', 'in_progress', 'submitted', 'completed')
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get project payment status
CREATE OR REPLACE FUNCTION get_project_payment_summary(project_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_creators', COUNT(*),
    'accepted_creators', COUNT(*) FILTER (WHERE status IN ('accepted', 'contracted', 'in_progress', 'submitted', 'completed')),
    'total_budget_allocated', COALESCE(SUM(agreed_amount), 0),
    'payments_completed', (
      SELECT COALESCE(SUM(amount), 0) 
      FROM project_creator_payments pcp
      JOIN project_creators pc ON pc.id = pcp.project_creator_id
      WHERE pc.project_id = project_uuid AND pcp.status = 'completed'
    ),
    'can_proceed_to_payment', project_has_accepted_creators(project_uuid)
  ) INTO result
  FROM project_creators 
  WHERE project_id = project_uuid;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Sample data insertion (for testing)
-- This would be handled by your application, but here for reference
/*
-- Example: Add creators to a project
INSERT INTO project_creators (project_id, creator_id, agreed_amount, payment_structure, content_requirements) VALUES
('project-uuid-here', 'creator-1-uuid', 1000.00, '{"milestones": [{"name": "contract", "percentage": 50}, {"name": "completion", "percentage": 50}]}', '{"videos": 2, "posts": 5}'),
('project-uuid-here', 'creator-2-uuid', 1500.00, '{"milestones": [{"name": "contract", "percentage": 30}, {"name": "draft", "percentage": 40}, {"name": "completion", "percentage": 30}]}', '{"videos": 3, "stories": 10}');

-- Example: Creator accepts invitation
UPDATE project_creators 
SET status = 'accepted', response_date = NOW()
WHERE project_id = 'project-uuid-here' AND creator_id = 'creator-1-uuid';

-- Example: Create payment for accepted creator
INSERT INTO project_creator_payments (project_creator_id, amount, milestone, status) VALUES
((SELECT id FROM project_creators WHERE project_id = 'project-uuid-here' AND creator_id = 'creator-1-uuid'), 500.00, 'contract_signing', 'pending');
*/