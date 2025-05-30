import { supabase } from '@/integrations/supabase/client';
import type { UserRole } from '@/lib/auth';

/**
 * Fetch a user's role from the database.
 * Tries user_roles first, then profiles, then user metadata.
 */
export const getUserRole = async (userId: string): Promise<UserRole | null> => {
  try {
    // Check dedicated user_roles table for an approved role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role, status')
      .eq('user_id', userId)
      .eq('status', 'approved')
      .maybeSingle();

    if (!roleError && roleData?.role) {
      return roleData.role as UserRole;
    }

    if (roleError) {
      console.error('Error fetching user role from user_roles:', roleError);
    }

    // Fallback to profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    if (!profileError && profileData?.role) {
      return profileData.role as UserRole;
    }

    if (profileError) {
      console.error('Error fetching user role from profiles:', profileError);
    }

    // Final fallback to auth metadata
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.user_metadata?.role) {
      return user.user_metadata.role as UserRole;
    }

    return null;
  } catch (err) {
    console.error('Failed to retrieve user role:', err);
    return null;
  }
};
