-- CRITICAL MISSING TABLES FOR OPENSOCIALS APPLICATION
-- These tables are referenced throughout the codebase but not defined in current migrations

-- 1. PROFILES table (Core user table - referenced everywhere)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('creator', 'brand', 'admin', 'super_admin')),
  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER_ROLES table (Role management with approval workflow)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('creator', 'brand', 'admin', 'super_admin')),
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- 3. PROJECTS table (Original projects table - still referenced)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft',
  budget DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Rolling payments additions
  total_creator_budget DECIMAL(10,2),
  allocated_budget DECIMAL(10,2) DEFAULT 0,
  allows_rolling_invitations BOOLEAN DEFAULT true,
  payment_terms JSONB,
  remaining_budget DECIMAL(10,2) GENERATED ALWAYS AS (COALESCE(total_creator_budget, 0) - COALESCE(allocated_budget, 0)) STORED
);

-- 4. Enhanced CREATOR_PROFILES table (Code expects many more fields)
-- Drop and recreate with full schema
DROP TABLE IF EXISTS creator_profiles CASCADE;
CREATE TABLE creator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Basic Info
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  
  -- Profile Setup
  is_profile_complete BOOLEAN DEFAULT FALSE,
  primary_platform TEXT,
  content_type TEXT,
  audience_type TEXT,
  creator_type TEXT,
  
  -- Social Media Data
  social_handles JSONB DEFAULT '{}',
  social_connections JSONB DEFAULT '{}',
  platforms TEXT[] DEFAULT '{}',
  content_types TEXT[] DEFAULT '{}',
  
  -- Audience & Analytics
  audience_size INTEGER,
  follower_count INTEGER,
  engagement_rate DECIMAL(5,4),
  audience_location JSONB DEFAULT '{}',
  
  -- Industry & Skills  
  industries TEXT[] DEFAULT '{}',
  
  -- Visibility Settings
  visibility_settings JSONB DEFAULT '{
    "showInstagram": true,
    "showTiktok": true, 
    "showYoutube": true,
    "showLinkedin": true,
    "showLocation": true,
    "showAnalytics": true
  }',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enhanced BRAND_PROFILES table (Code expects more fields)
-- Add missing columns to existing table
ALTER TABLE brand_profiles 
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS budget_range TEXT,
ADD COLUMN IF NOT EXISTS brand_bio TEXT,
ADD COLUMN IF NOT EXISTS brand_goal TEXT,
ADD COLUMN IF NOT EXISTS campaign_focus TEXT[];

-- 6. SECURITY_AUDIT_LOG table (Referenced in RLS policies)
CREATE TABLE IF NOT EXISTS security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BRAND_CREATOR_CONNECTIONS table (Invitation system)
CREATE TABLE IF NOT EXISTS brand_creator_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'connected', 'disconnected')) DEFAULT 'pending',
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  connected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brand_id, creator_id)
);

-- 8. DEALS table (Still referenced in some components)
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fix content_status enum (referenced in project_content but not in rolling payments migration)
DO $$ 
BEGIN
  -- Add content_status enum if not exists
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_status') THEN
    CREATE TYPE content_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'published', 'archived');
  END IF;
  
  -- Add project_creator_status enum if not exists  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_creator_status') THEN
    CREATE TYPE project_creator_status AS ENUM ('invited', 'accepted', 'declined', 'contracted', 'in_progress', 'submitted', 'completed', 'cancelled');
  END IF;
END $$;

-- Fix foreign key references in rolling payments tables
-- project_creators should reference profiles, not projects for creator_id
ALTER TABLE project_creators 
DROP CONSTRAINT IF EXISTS project_creators_project_id_fkey,
ADD CONSTRAINT project_creators_project_id_fkey 
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

-- RLS Policies for missing tables

-- Profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- User roles RLS  
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own roles" ON user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can request roles" ON user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Projects RLS (if not already exists)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "brands_manage_own_projects_old" ON projects;
CREATE POLICY "brands_manage_own_projects_old" ON projects
  FOR ALL USING (brand_id = auth.uid());

-- Creator profiles RLS
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "creator_profiles_own_access" ON creator_profiles
  FOR ALL USING (user_id = auth.uid());
CREATE POLICY "creator_profiles_public_read" ON creator_profiles  
  FOR SELECT USING (true);

-- Brand creator connections RLS
ALTER TABLE brand_creator_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "brand_creator_connections_access" ON brand_creator_connections
  FOR ALL USING (brand_id = auth.uid() OR creator_id = auth.uid());

-- Deals RLS
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deals_participant_access" ON deals
  FOR ALL USING (brand_id = auth.uid() OR creator_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_status ON user_roles(status);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_user_id ON creator_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_username ON creator_profiles(username);
CREATE INDEX IF NOT EXISTS idx_brand_creator_connections_brand_id ON brand_creator_connections(brand_id);
CREATE INDEX IF NOT EXISTS idx_brand_creator_connections_creator_id ON brand_creator_connections(creator_id);
CREATE INDEX IF NOT EXISTS idx_deals_brand_id ON deals(brand_id);
CREATE INDEX IF NOT EXISTS idx_deals_creator_id ON deals(creator_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON security_audit_log(user_id);

-- Update triggers for timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON user_roles  
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_profiles_updated_at BEFORE UPDATE ON creator_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_creator_connections_updated_at BEFORE UPDATE ON brand_creator_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON user_roles TO authenticated;  
GRANT ALL ON creator_profiles TO authenticated;
GRANT ALL ON brand_creator_connections TO authenticated;
GRANT ALL ON deals TO authenticated;
GRANT ALL ON security_audit_log TO authenticated;

-- Comments
COMMENT ON TABLE profiles IS 'Core user profiles table - central to all authentication';
COMMENT ON TABLE user_roles IS 'Role management with approval workflow';
COMMENT ON TABLE creator_profiles IS 'Comprehensive creator profile data';
COMMENT ON TABLE brand_creator_connections IS 'Brand-creator invitation and connection system';
COMMENT ON TABLE deals IS 'Legacy deals table still referenced in code';