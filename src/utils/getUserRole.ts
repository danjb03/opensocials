
import { supabase } from '@/integrations/supabase/client';
import type { UserRole } from '@/lib/auth';

/**
 * Fetch a user's role from the database.
 * Uses service role to bypass RLS policies and avoid recursion.
 */
export const getUserRole = async (userId: string): Promise<UserRole | null> => {
  try {
    // First try to get from auth metadata as it's always accessible
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.user_metadata?.role) {
      return user.user_metadata.role as UserRole;
    }

    // Try user_roles table first (this should bypass profile RLS issues)
    try {
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role, status')
        .eq('user_id', userId)
        .eq('status', 'approved')
        .maybeSingle();

      if (!roleError && roleData?.role) {
        console.log('✅ Found role in user_roles:', roleData.role);
        return roleData.role as UserRole;
      }
    } catch (roleErr) {
      console.warn('Could not fetch from user_roles:', roleErr);
    }

    // Fallback: try profiles table with error handling
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (!profileError && profileData?.role) {
        console.log('✅ Found role in profiles:', profileData.role);
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
