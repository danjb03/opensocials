
-- Create campaign review status tracking
CREATE TABLE IF NOT EXISTS public.campaign_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects_new(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.profiles(id),
  ai_analysis JSONB DEFAULT '{}',
  ai_score NUMERIC(3,2), -- 0.00 to 1.00 confidence score
  ai_issues JSONB DEFAULT '[]', -- Array of detected issues
  ai_recommendations JSONB DEFAULT '[]', -- Array of recommendations
  human_decision TEXT CHECK (human_decision IN ('pending', 'approved', 'rejected', 'needs_revision')),
  ai_decision TEXT CHECK (ai_decision IN ('approved', 'rejected', 'flagged', 'needs_review')),
  review_notes TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create R4 rule violations tracking for campaigns
CREATE TABLE IF NOT EXISTS public.campaign_rule_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_review_id UUID NOT NULL REFERENCES public.campaign_reviews(id) ON DELETE CASCADE,
  rule_id UUID REFERENCES public.r4_rules(id),
  rule_name TEXT NOT NULL,
  violation_type TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT,
  auto_detected BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add review status to projects_new table
ALTER TABLE public.projects_new 
ADD COLUMN IF NOT EXISTS review_status TEXT CHECK (review_status IN ('pending_review', 'under_review', 'approved', 'rejected', 'needs_revision')) DEFAULT 'pending_review',
ADD COLUMN IF NOT EXISTS review_priority TEXT CHECK (review_priority IN ('low', 'normal', 'high', 'urgent')) DEFAULT 'normal';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_campaign_reviews_project_id ON public.campaign_reviews(project_id);
CREATE INDEX IF NOT EXISTS idx_campaign_reviews_status ON public.campaign_reviews(human_decision);
CREATE INDEX IF NOT EXISTS idx_projects_review_status ON public.projects_new(review_status);

-- Enable RLS
ALTER TABLE public.campaign_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_rule_violations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admins can manage campaign reviews" ON public.campaign_reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin') 
      AND status = 'approved'
    )
  );

CREATE POLICY "Admins can manage rule violations" ON public.campaign_rule_violations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin') 
      AND status = 'approved'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_campaign_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_campaign_reviews_updated_at ON public.campaign_reviews;
CREATE TRIGGER update_campaign_reviews_updated_at
  BEFORE UPDATE ON public.campaign_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_campaign_reviews_updated_at();
