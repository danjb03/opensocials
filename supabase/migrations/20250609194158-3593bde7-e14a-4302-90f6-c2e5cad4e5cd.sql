
-- Create agency_users table to define which users belong to which agency
CREATE TABLE public.agency_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'managed_user', -- 'managed_user', 'managed_brand', 'managed_creator'
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(agency_id, user_id)
);

-- Enable RLS on agency_users
ALTER TABLE public.agency_users ENABLE ROW LEVEL SECURITY;

-- Create policies for agency_users table
CREATE POLICY "Agencies can manage their users" ON public.agency_users
  FOR ALL USING (agency_id = auth.uid());

CREATE POLICY "Super admins can see all agency relationships" ON public.agency_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Create security definer function to check if user belongs to agency
CREATE OR REPLACE FUNCTION public.user_belongs_to_agency(user_id uuid, agency_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.agency_users 
    WHERE agency_users.user_id = $1 AND agency_users.agency_id = $2
  );
$$;

-- Create function to get current user's agency (if they are managed by one)
CREATE OR REPLACE FUNCTION public.get_user_agency()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT agency_id FROM public.agency_users 
  WHERE user_id = auth.uid() 
  LIMIT 1;
$$;

-- Create function to check if current user is an agency
CREATE OR REPLACE FUNCTION public.is_agency_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'agency'
  );
$$;

-- Update profiles table RLS policies to include agency scoping
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view accessible profiles" ON public.profiles
  FOR SELECT USING (
    id = auth.uid() OR -- Own profile
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')) OR -- Admin access
    (
      public.is_agency_user() AND 
      public.user_belongs_to_agency(profiles.id, auth.uid())
    ) -- Agency can see their managed users
  );

CREATE POLICY "Users can update accessible profiles" ON public.profiles
  FOR UPDATE USING (
    id = auth.uid() OR -- Own profile
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')) OR -- Admin access
    (
      public.is_agency_user() AND 
      public.user_belongs_to_agency(profiles.id, auth.uid())
    ) -- Agency can update their managed users
  );

-- Update user_roles table RLS policies
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Users can view accessible roles" ON public.user_roles
  FOR SELECT USING (
    user_id = auth.uid() OR -- Own roles
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')) OR -- Admin access
    (
      public.is_agency_user() AND 
      public.user_belongs_to_agency(user_roles.user_id, auth.uid())
    ) -- Agency can see their managed users' roles
  );

-- Update brand_profiles table RLS policies
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view accessible brand profiles" ON public.brand_profiles
  FOR SELECT USING (
    user_id = auth.uid() OR -- Own profile
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')) OR -- Admin access
    (
      public.is_agency_user() AND 
      public.user_belongs_to_agency(brand_profiles.user_id, auth.uid())
    ) -- Agency can see their managed brands
  );

CREATE POLICY "Users can update accessible brand profiles" ON public.brand_profiles
  FOR UPDATE USING (
    user_id = auth.uid() OR -- Own profile
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')) OR -- Admin access
    (
      public.is_agency_user() AND 
      public.user_belongs_to_agency(brand_profiles.user_id, auth.uid())
    ) -- Agency can update their managed brands
  );

-- Update creator_profiles table RLS policies
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view accessible creator profiles" ON public.creator_profiles
  FOR SELECT USING (
    user_id = auth.uid() OR -- Own profile
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')) OR -- Admin access
    (
      public.is_agency_user() AND 
      public.user_belongs_to_agency(creator_profiles.user_id, auth.uid())
    ) -- Agency can see their managed creators
  );

CREATE POLICY "Users can update accessible creator profiles" ON public.creator_profiles
  FOR UPDATE USING (
    user_id = auth.uid() OR -- Own profile
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')) OR -- Admin access
    (
      public.is_agency_user() AND 
      public.user_belongs_to_agency(creator_profiles.user_id, auth.uid())
    ) -- Agency can update their managed creators
  );

-- Update projects table RLS policies
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view accessible projects" ON public.projects
  FOR SELECT USING (
    brand_id = auth.uid() OR -- Own projects
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')) OR -- Admin access
    (
      public.is_agency_user() AND 
      public.user_belongs_to_agency(projects.brand_id, auth.uid())
    ) -- Agency can see their managed brands' projects
  );

-- Update creator_deals table RLS policies
ALTER TABLE public.creator_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view accessible deals" ON public.creator_deals
  FOR SELECT USING (
    creator_id = auth.uid() OR -- Own deals as creator
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = creator_deals.project_id AND projects.brand_id = auth.uid()
    ) OR -- Own deals as brand
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')) OR -- Admin access
    (
      public.is_agency_user() AND (
        public.user_belongs_to_agency(creator_deals.creator_id, auth.uid()) OR
        EXISTS (
          SELECT 1 FROM public.projects 
          WHERE projects.id = creator_deals.project_id 
          AND public.user_belongs_to_agency(projects.brand_id, auth.uid())
        )
      )
    ) -- Agency can see deals involving their managed users
  );

-- Update deals table RLS policies
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view accessible deals" ON public.deals
  FOR SELECT USING (
    creator_id = auth.uid() OR brand_id = auth.uid() OR -- Own deals
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')) OR -- Admin access
    (
      public.is_agency_user() AND (
        public.user_belongs_to_agency(deals.creator_id, auth.uid()) OR
        public.user_belongs_to_agency(deals.brand_id, auth.uid())
      )
    ) -- Agency can see deals involving their managed users
  );
