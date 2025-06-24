
-- Create campaign_submissions table to track creator content uploads
CREATE TABLE public.campaign_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES public.projects_new(id) ON DELETE CASCADE NOT NULL,
  creator_id uuid NOT NULL,
  submission_type text NOT NULL DEFAULT 'content', -- 'content', 'revision'
  content_data jsonb NOT NULL DEFAULT '{}', -- stores file URLs, captions, etc
  status text NOT NULL DEFAULT 'draft', -- 'draft', 'submitted', 'approved', 'revision_requested', 'rejected'
  submission_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  submitted_at timestamp with time zone,
  reviewed_at timestamp with time zone
);

-- Create submission_reviews table for brand feedback and revision requests
CREATE TABLE public.submission_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES public.campaign_submissions(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid NOT NULL, -- brand user ID
  action text NOT NULL, -- 'approve', 'request_revision', 'reject'
  feedback_text text,
  review_data jsonb DEFAULT '{}', -- additional structured feedback
  created_at timestamp with time zone DEFAULT now()
);

-- Create notifications table for creator/brand communications
CREATE TABLE public.campaign_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL, -- recipient
  campaign_id uuid REFERENCES public.projects_new(id) ON DELETE CASCADE,
  submission_id uuid REFERENCES public.campaign_submissions(id) ON DELETE CASCADE,
  notification_type text NOT NULL, -- 'submission_received', 'review_completed', 'revision_requested', 'campaign_launched'
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_campaign_submissions_campaign_creator ON public.campaign_submissions(campaign_id, creator_id);
CREATE INDEX idx_campaign_submissions_status ON public.campaign_submissions(status);
CREATE INDEX idx_submission_reviews_submission_id ON public.submission_reviews(submission_id);
CREATE INDEX idx_campaign_notifications_user_id ON public.campaign_notifications(user_id);
CREATE INDEX idx_campaign_notifications_unread ON public.campaign_notifications(user_id, is_read);

-- Add RLS policies
ALTER TABLE public.campaign_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_notifications ENABLE ROW LEVEL SECURITY;

-- Campaign submissions policies - creators can manage their own, brands can view their campaigns
CREATE POLICY "Creators can manage their submissions" ON public.campaign_submissions
  FOR ALL USING (
    creator_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.projects_new p 
      WHERE p.id = campaign_id AND p.brand_id = auth.uid()
    )
  );

-- Submission reviews policies - brands can review their campaigns
CREATE POLICY "Brands can review their campaign submissions" ON public.submission_reviews
  FOR ALL USING (
    reviewer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.campaign_submissions cs
      JOIN public.projects_new p ON p.id = cs.campaign_id
      WHERE cs.id = submission_id AND (p.brand_id = auth.uid() OR cs.creator_id = auth.uid())
    )
  );

-- Notifications policies - users can see their own notifications
CREATE POLICY "Users can see their notifications" ON public.campaign_notifications
  FOR ALL USING (user_id = auth.uid());

-- Update projects_new status enum to include review states
ALTER TABLE public.projects_new 
ADD COLUMN IF NOT EXISTS review_stage text DEFAULT 'campaign_setup';
-- review_stage: 'campaign_setup', 'awaiting_submissions', 'reviewing_content', 'ready_to_launch', 'live', 'completed'

-- Add trigger to update updated_at on campaign_submissions
CREATE OR REPLACE FUNCTION update_campaign_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_campaign_submissions_updated_at
  BEFORE UPDATE ON public.campaign_submissions
  FOR EACH ROW EXECUTE FUNCTION update_campaign_submissions_updated_at();
