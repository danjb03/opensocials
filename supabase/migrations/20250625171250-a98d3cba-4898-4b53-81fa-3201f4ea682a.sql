
-- Create the creators_social_accounts table for social media connections
CREATE TABLE public.creators_social_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  handle TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ready',
  next_run TIMESTAMP WITH TIME ZONE,
  last_run TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(creator_id, platform, handle)
);

-- Add Row Level Security
ALTER TABLE public.creators_social_accounts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own social accounts
CREATE POLICY "Users can view own social accounts" 
  ON public.creators_social_accounts 
  FOR SELECT 
  USING (auth.uid() = creator_id);

-- Users can insert their own social accounts
CREATE POLICY "Users can create own social accounts" 
  ON public.creators_social_accounts 
  FOR INSERT 
  WITH CHECK (auth.uid() = creator_id);

-- Users can update their own social accounts
CREATE POLICY "Users can update own social accounts" 
  ON public.creators_social_accounts 
  FOR UPDATE 
  USING (auth.uid() = creator_id);

-- Users can delete their own social accounts
CREATE POLICY "Users can delete own social accounts" 
  ON public.creators_social_accounts 
  FOR DELETE 
  USING (auth.uid() = creator_id);

-- Create social_jobs table to track Apify job status
CREATE TABLE public.social_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES public.creators_social_accounts(id) ON DELETE CASCADE,
  apify_run_id TEXT NOT NULL,
  actor_type TEXT NOT NULL DEFAULT 'primary',
  status TEXT NOT NULL DEFAULT 'running',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  result_data JSONB
);

-- Add RLS for social_jobs
ALTER TABLE public.social_jobs ENABLE ROW LEVEL SECURITY;

-- Create policy for social_jobs access
CREATE POLICY "Users can view own social jobs" 
  ON public.social_jobs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.creators_social_accounts 
      WHERE id = account_id AND creator_id = auth.uid()
    )
  );

-- Create admin_operations table for tracking system operations
CREATE TABLE public.admin_operations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operation TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Add RLS for admin_operations (admin access only)
ALTER TABLE public.admin_operations ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger for creators_social_accounts
CREATE OR REPLACE FUNCTION update_creators_social_accounts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER creators_social_accounts_updated_at
  BEFORE UPDATE ON public.creators_social_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_creators_social_accounts_updated_at();
