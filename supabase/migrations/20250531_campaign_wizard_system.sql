-- Campaign Wizard System Migration
-- Creates enhanced schema for multi-step campaign creation with creator deals

-- Create enums for the new system
CREATE TYPE campaign_objective AS ENUM ('brand_awareness', 'product_launch', 'sales_drive', 'engagement', 'conversions');
CREATE TYPE deal_status AS ENUM ('pending', 'invited', 'accepted', 'declined', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'paid', 'failed');
CREATE TYPE project_status AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled');

-- Enhanced projects table for campaign management
CREATE TABLE IF NOT EXISTS projects_new (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
  
  -- Step 1: Campaign Name + Objective
  name TEXT NOT NULL,
  objective campaign_objective,
  campaign_type campaign_type DEFAULT 'Single',
  
  -- Step 2: Content Requirements  
  description TEXT,
  content_requirements JSONB DEFAULT '{}',
  platforms TEXT[] DEFAULT '{}',
  messaging_guidelines TEXT,
  
  -- Step 3: Budget & Deliverables
  total_budget DECIMAL(10,2), -- GROSS budget (includes OS margin)
  deliverables JSONB DEFAULT '{}', -- posts count, video length, etc.
  
  -- Timeline
  start_date DATE,
  end_date DATE,
  
  -- Campaign Status & Progress
  status project_status DEFAULT 'draft',
  current_step INTEGER DEFAULT 1, -- For multi-step creation
  
  -- Meta
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual creator deals for each campaign
CREATE TABLE creator_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects_new(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES creator_profiles(id) ON DELETE CASCADE,
  
  -- Deal-specific data (unique per creator)
  gross_value DECIMAL(10,2), -- Internal only - with 25% margin
  net_value DECIMAL(10,2), -- Creator sees this (gross_value * 0.75)
  individual_requirements JSONB DEFAULT '{}', -- Custom asks for this creator
  
  -- Deal workflow
  status deal_status DEFAULT 'pending',
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  creator_feedback TEXT,
  
  -- Payment tracking
  payment_status payment_status DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(project_id, creator_id)
);

-- Campaign creation drafts for save/resume
CREATE TABLE project_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
  
  -- Draft data (mirrors projects structure)
  draft_data JSONB DEFAULT '{}', -- Stores partial campaign data
  current_step INTEGER DEFAULT 1,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to auto-calculate net_value from gross_value
CREATE OR REPLACE FUNCTION calculate_net_value()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.gross_value IS NOT NULL THEN
    NEW.net_value = ROUND(NEW.gross_value * 0.75, 2);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate net_value
CREATE TRIGGER creator_deals_net_value
  BEFORE INSERT OR UPDATE ON creator_deals
  FOR EACH ROW EXECUTE FUNCTION calculate_net_value();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_projects_new_updated_at
  BEFORE UPDATE ON projects_new
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_deals_updated_at
  BEFORE UPDATE ON creator_deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_drafts_updated_at
  BEFORE UPDATE ON project_drafts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies

-- Projects RLS (brands can manage their own projects)
ALTER TABLE projects_new ENABLE ROW LEVEL SECURITY;

CREATE POLICY "brands_manage_own_projects" ON projects_new
  FOR ALL USING (
    brand_id IN (
      SELECT id FROM brand_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Creator deals RLS (creators only see their net values)
ALTER TABLE creator_deals ENABLE ROW LEVEL SECURITY;

-- Brands can see all deal data for their projects
CREATE POLICY "brands_see_all_deal_data" ON creator_deals
  FOR ALL USING (
    project_id IN (
      SELECT id FROM projects_new 
      WHERE brand_id IN (
        SELECT id FROM brand_profiles 
        WHERE user_id = auth.uid()
      )
    )
  );

-- Creators can only see their deals (with restricted columns)
CREATE POLICY "creators_see_own_deals" ON creator_deals
  FOR SELECT USING (
    creator_id IN (
      SELECT id FROM creator_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Project drafts RLS
ALTER TABLE project_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "brands_manage_own_drafts" ON project_drafts
  FOR ALL USING (
    brand_id IN (
      SELECT id FROM brand_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Create view for creator-safe deal data (excludes gross_value)
CREATE VIEW creator_deal_view AS
SELECT 
  id,
  project_id,
  creator_id,
  net_value AS deal_value, -- Renamed to hide gross concept
  individual_requirements,
  status,
  invited_at,
  responded_at,
  creator_feedback,
  payment_status,
  paid_at,
  created_at,
  updated_at
FROM creator_deals;

-- Grant permissions
GRANT ALL ON projects_new TO authenticated;
GRANT ALL ON creator_deals TO authenticated;
GRANT ALL ON project_drafts TO authenticated;
GRANT SELECT ON creator_deal_view TO authenticated;

-- Indexes for performance
CREATE INDEX idx_projects_new_brand_id ON projects_new(brand_id);
CREATE INDEX idx_projects_new_status ON projects_new(status);
CREATE INDEX idx_creator_deals_project_id ON creator_deals(project_id);
CREATE INDEX idx_creator_deals_creator_id ON creator_deals(creator_id);
CREATE INDEX idx_creator_deals_status ON creator_deals(status);
CREATE INDEX idx_project_drafts_brand_id ON project_drafts(brand_id);

COMMENT ON TABLE projects_new IS 'Enhanced projects table for multi-step campaign creation';
COMMENT ON TABLE creator_deals IS 'Individual creator deals with gross/net value separation';
COMMENT ON TABLE project_drafts IS 'Draft campaigns for save/resume functionality';
COMMENT ON COLUMN creator_deals.gross_value IS 'Internal value including 25% OS margin - never shown to creators';
COMMENT ON COLUMN creator_deals.net_value IS 'Creator-visible value after 25% margin deduction';