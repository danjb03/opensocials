
-- Fix RLS policies for brand_profiles table to allow super admin access
DROP POLICY IF EXISTS "Users can view their own brand profiles" ON public.brand_profiles;
DROP POLICY IF EXISTS "Users can update their own brand profiles" ON public.brand_profiles;
DROP POLICY IF EXISTS "Users can insert their own brand profiles" ON public.brand_profiles;

-- Create new RLS policies that allow super admins to access everything
CREATE POLICY "Super admins can view all brand profiles" ON public.brand_profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin' 
    AND status = 'approved'
  )
  OR auth.uid() = user_id
);

CREATE POLICY "Super admins can insert brand profiles" ON public.brand_profiles
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin' 
    AND status = 'approved'
  )
  OR auth.uid() = user_id
);

CREATE POLICY "Super admins can update brand profiles" ON public.brand_profiles
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin' 
    AND status = 'approved'
  )
  OR auth.uid() = user_id
);

-- Fix RLS policies for profiles table to allow super admin access
DROP POLICY IF EXISTS "Users can view their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profiles" ON public.profiles;

CREATE POLICY "Super admins can view all profiles" ON public.profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin' 
    AND status = 'approved'
  )
  OR auth.uid() = id
);

CREATE POLICY "Super admins can update all profiles" ON public.profiles
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin' 
    AND status = 'approved'
  )
  OR auth.uid() = id
);

-- Ensure RLS is enabled on both tables
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
