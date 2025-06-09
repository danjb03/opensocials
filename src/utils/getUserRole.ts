
import { supabase } from '@/integrations/supabase/client';
import type { UserRole } from '@/lib/auth';

/**
 * Fetch a user's role from the database.
 * Prioritizes user_roles table over metadata for accuracy.
 */
export const getUserRole = async (userId: string): Promise<UserRole | null> => {
  try {
    console.log('🔍 Fetching role for user:', userId);

    // PRIORITY 1: Try user_roles table first (most authoritative)
    try {
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role, status')
        .eq('user_id', userId)
        .eq('status', 'approved')
        .maybeSingle();

      if (!roleError && roleData?.role) {
        console.log('✅ Found role in user_roles (priority 1):', roleData.role);
        return roleData.role as UserRole;
      }
      
      if (roleError) {
        console.warn('user_roles query error:', roleError.message);
      }
    } catch (roleErr) {
      console.warn('Could not fetch from user_roles:', roleErr);
    }

    // PRIORITY 2: Try auth metadata as fallback
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.role) {
        console.log('✅ Found role in metadata (priority 2):', user.user_metadata.role);
        return user.user_metadata.role as UserRole;
      }
    } catch (metaErr) {
      console.warn('Could not fetch from metadata:', metaErr);
    }

    // PRIORITY 3: Try profiles table as last resort
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (!profileError && profileData?.role) {
        console.log('✅ Found role in profiles (priority 3):', profileData.role);
        return profileData.role as UserRole;
      }

      if (profileError) {
        console.warn('Profile fetch error (may be RLS recursion):', profileError.message);
      }
    } catch (profileErr) {
      console.warn('Could not fetch from profiles:', profileErr);
    }

    console.warn('❌ No role found for user:', userId);
    return null;
  } catch (err) {
    console.error('❌ Failed to retrieve user role:', err);
    return null;
  }
};
