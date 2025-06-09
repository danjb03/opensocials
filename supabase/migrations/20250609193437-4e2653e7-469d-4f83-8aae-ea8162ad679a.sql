
-- Add agency role to the existing app_role enum
ALTER TYPE public.app_role ADD VALUE 'agency';

-- Update any existing role-related policies to include agency where appropriate
-- Note: Agencies should have similar permissions to admins but scoped to their own data
