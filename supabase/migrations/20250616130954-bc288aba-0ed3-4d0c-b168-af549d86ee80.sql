
-- Drop existing RLS policies for project_drafts if they exist
DROP POLICY IF EXISTS "Users can manage their own drafts" ON project_drafts;
DROP POLICY IF EXISTS "Users can view their own drafts" ON project_drafts;
DROP POLICY IF EXISTS "Users can create their own drafts" ON project_drafts;
DROP POLICY IF EXISTS "Users can update their own drafts" ON project_drafts;
DROP POLICY IF EXISTS "Users can delete their own drafts" ON project_drafts;

-- Create comprehensive RLS policies for project_drafts
CREATE POLICY "Users can view their own drafts" 
  ON project_drafts 
  FOR SELECT 
  USING (auth.uid() = brand_id);

CREATE POLICY "Users can create their own drafts" 
  ON project_drafts 
  FOR INSERT 
  WITH CHECK (auth.uid() = brand_id);

CREATE POLICY "Users can update their own drafts" 
  ON project_drafts 
  FOR UPDATE 
  USING (auth.uid() = brand_id);

CREATE POLICY "Users can delete their own drafts" 
  ON project_drafts 
  FOR DELETE 
  USING (auth.uid() = brand_id);
