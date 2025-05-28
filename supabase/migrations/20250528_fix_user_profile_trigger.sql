
-- Drop the existing trigger first to avoid dependency issues
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users CASCADE;

-- Drop the existing function with CASCADE to handle any remaining dependencies
DROP FUNCTION IF EXISTS public.handle_new_user_profile() CASCADE;

-- Create the corrected function with proper type casting
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_role TEXT;
  user_first_name TEXT;
  user_last_name TEXT;
  user_company_name TEXT;
BEGIN
  -- Extract data from user metadata with proper type casting
  user_role := LOWER(COALESCE(NEW.raw_user_meta_data->>'role', '')::text);
  user_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '')::text;
  user_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '')::text;
  
  -- Handle company name for brand users
  IF user_role = 'brand' THEN
    user_company_name := COALESCE(
      NEW.raw_user_meta_data->>'company_name',
      CONCAT(user_first_name, ' ', user_last_name, '''s Brand')
    )::text;
  ELSE
    user_company_name := NULL;
  END IF;
  
  -- Create profile entry with error handling
  BEGIN
    INSERT INTO public.profiles (
      id,
      email,
      role,
      first_name,
      last_name,
      created_at,
      updated_at,
      status,
      is_complete,
      company_name
    ) VALUES (
      NEW.id,
      NEW.email,
      user_role,
      NULLIF(user_first_name, ''),
      NULLIF(user_last_name, ''),
      NOW(),
      NOW(),
      'accepted',
      CASE WHEN user_role = 'brand' THEN true ELSE false END,
      NULLIF(user_company_name, '')
    );
  EXCEPTION
    WHEN OTHERS THEN
      -- Log the error but don't block user creation
      RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
      RETURN NEW;
  END;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user_profile();
