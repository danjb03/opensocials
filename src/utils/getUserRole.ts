
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

    console.warn('❌ No role found for user:', userId);
    return null;
  } catch (err) {
    console.error('❌ Failed to retrieve user role:', err);
    return null;
  }
};

/**
 * Update user metadata to fix stale role information
 */
export const updateUserMetadata = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    console.log('🔄 Updating user metadata for user:', userId, 'to role:', role);
    
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role }
    });

    if (error) {
      console.error('❌ Failed to update user metadata:', error);
      return false;
    }

    console.log('✅ User metadata updated successfully');
    return true;
  } catch (err) {
    console.error('❌ Error updating user metadata:', err);
    return false;
  }
};

/**
 * Clear auth state to force fresh role lookup
 */
export const clearAuthState = () => {
  try {
    // Clear all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
    
    console.log('🧹 Auth state cleared');
  } catch (err) {
    console.error('❌ Error clearing auth state:', err);
  }
};
