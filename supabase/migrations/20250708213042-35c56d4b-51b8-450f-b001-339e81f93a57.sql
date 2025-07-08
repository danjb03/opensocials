
-- Add Row Level Security policies to prevent cross-account data access

-- Secure project_creators table
ALTER TABLE public.project_creators ENABLE ROW LEVEL SECURITY;

-- Creators can only see their own project invitations
CREATE POLICY "Creators can view their own project invitations" 
  ON public.project_creators 
  FOR SELECT 
  USING (auth.uid() = creator_id);

-- Brands can only see project creators for their own projects
CREATE POLICY "Brands can view project creators for their projects" 
  ON public.project_creators 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.projects_new p 
      WHERE p.id = project_creators.project_id 
      AND p.brand_id = auth.uid()
    )
  );

-- Only brands can insert project creators for their own projects
CREATE POLICY "Brands can invite creators to their projects" 
  ON public.project_creators 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects_new p 
      WHERE p.id = project_creators.project_id 
      AND p.brand_id = auth.uid()
    )
  );

-- Only creators can update their own invitation responses
CREATE POLICY "Creators can update their own invitations" 
  ON public.project_creators 
  FOR UPDATE 
  USING (auth.uid() = creator_id);

-- Brands can update invitations for their own projects
CREATE POLICY "Brands can update invitations for their projects" 
  ON public.project_creators 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.projects_new p 
      WHERE p.id = project_creators.project_id 
      AND p.brand_id = auth.uid()
    )
  );

-- Secure creator_deals table
ALTER TABLE public.creator_deals ENABLE ROW LEVEL SECURITY;

-- Creators can view their own deals
CREATE POLICY "Creators can view their own deals" 
  ON public.creator_deals 
  FOR SELECT 
  USING (auth.uid() = creator_id);

-- Brands can view deals for their own projects
CREATE POLICY "Brands can view deals for their projects" 
  ON public.creator_deals 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.projects_new p 
      WHERE p.id = creator_deals.project_id 
      AND p.brand_id = auth.uid()
    )
  );

-- Only system can insert deals (via edge functions)
CREATE POLICY "System can manage deals" 
  ON public.creator_deals 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.projects_new p 
      WHERE p.id = creator_deals.project_id 
      AND (p.brand_id = auth.uid() OR creator_deals.creator_id = auth.uid())
    )
  );

-- Secure brand_creator_connections table
ALTER TABLE public.brand_creator_connections ENABLE ROW LEVEL SECURITY;

-- Brands can manage their own connections
CREATE POLICY "Brands can manage their connections" 
  ON public.brand_creator_connections 
  FOR ALL 
  USING (auth.uid() = brand_id);

-- Creators can view and respond to their connections
CREATE POLICY "Creators can view their connections" 
  ON public.brand_creator_connections 
  FOR SELECT 
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can update their connection responses" 
  ON public.brand_creator_connections 
  FOR UPDATE 
  USING (auth.uid() = creator_id);

-- Add foreign key constraints to ensure data integrity
ALTER TABLE public.project_creators 
ADD CONSTRAINT fk_project_creators_creator 
FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.project_creators 
ADD CONSTRAINT fk_project_creators_project 
FOREIGN KEY (project_id) REFERENCES public.projects_new(id) ON DELETE CASCADE;

ALTER TABLE public.creator_deals 
ADD CONSTRAINT fk_creator_deals_creator 
FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.creator_deals 
ADD CONSTRAINT fk_creator_deals_project 
FOREIGN KEY (project_id) REFERENCES public.projects_new(id) ON DELETE CASCADE;

-- Add unique constraint to prevent duplicate invitations
ALTER TABLE public.project_creators 
ADD CONSTRAINT unique_project_creator 
UNIQUE (project_id, creator_id);

-- Add check constraints for valid statuses
ALTER TABLE public.project_creators 
ADD CONSTRAINT valid_status 
CHECK (status IN ('invited', 'accepted', 'declined', 'contracted', 'in_progress', 'submitted', 'completed', 'cancelled'));

ALTER TABLE public.creator_deals 
ADD CONSTRAINT valid_deal_status 
CHECK (status IN ('pending', 'invited', 'accepted', 'declined', 'completed', 'cancelled'));

ALTER TABLE public.brand_creator_connections 
ADD CONSTRAINT valid_connection_status 
CHECK (status IN ('outreach', 'invited', 'accepted', 'declined'));
