
-- Enable RLS on projects_new table if not already enabled
ALTER TABLE public.projects_new ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own campaigns" ON public.projects_new;
DROP POLICY IF EXISTS "Users can create their own campaigns" ON public.projects_new;
DROP POLICY IF EXISTS "Users can update their own campaigns" ON public.projects_new;
DROP POLICY IF EXISTS "Users can delete their own campaigns" ON public.projects_new;

-- Create policies to allow users to manage their own campaigns
CREATE POLICY "Users can view their own campaigns" 
  ON public.projects_new 
  FOR SELECT 
  USING (auth.uid() = brand_id);

CREATE POLICY "Users can create their own campaigns" 
  ON public.projects_new 
  FOR INSERT 
  WITH CHECK (auth.uid() = brand_id);

CREATE POLICY "Users can update their own campaigns" 
  ON public.projects_new 
  FOR UPDATE 
  USING (auth.uid() = brand_id);

CREATE POLICY "Users can delete their own campaigns" 
  ON public.projects_new 
  FOR DELETE 
  USING (auth.uid() = brand_id);
