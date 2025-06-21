
-- Remove unused content requirements fields and add campaign brief data
ALTER TABLE public.projects_new 
DROP COLUMN IF EXISTS content_requirements,
DROP COLUMN IF EXISTS messaging_guidelines;

-- Add brief_data column to store campaign brief responses
ALTER TABLE public.projects_new 
ADD COLUMN brief_data JSONB DEFAULT '{}'::jsonb;

-- Update any existing project drafts to remove old content requirements data
-- Only update rows where draft_data is a JSON object (not scalar)
UPDATE public.project_drafts 
SET draft_data = draft_data - 'content_requirements' - 'messaging_guidelines'
WHERE draft_data IS NOT NULL 
  AND jsonb_typeof(draft_data) = 'object';
