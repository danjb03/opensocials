
-- Enable Row Level Security on creator_profiles table
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own creator profile
CREATE POLICY "Users can view their own creator profile" 
  ON public.creator_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to insert their own creator profile
CREATE POLICY "Users can create their own creator profile" 
  ON public.creator_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own creator profile
CREATE POLICY "Users can update their own creator profile" 
  ON public.creator_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow users to delete their own creator profile
CREATE POLICY "Users can delete their own creator profile" 
  ON public.creator_profiles 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Allow admins to view all creator profiles
CREATE POLICY "Admins can view all creator profiles" 
  ON public.creator_profiles 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to update all creator profiles
CREATE POLICY "Admins can update all creator profiles" 
  ON public.creator_profiles 
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );
