
import { supabase } from '@/integrations/supabase/client';
import type { UserRole } from '@/lib/auth';

// Valid role values that match the database enum
const VALID_ROLES: UserRole[] = ['creator', 'brand', 'admin', 'agency', 'super_admin'];

/**
 * Validate if a string is a valid UserRole
 */
const isValidRole = (role: string): role is UserRole => {
  return VALID_ROLES.includes(role as UserRole);
};

/**
 * Fetch a user's role from the database.
 * Uses the new security definer function to avoid RLS recursion.
 */
export const getUserRole = async (userId: string): Promise<UserRole | null> => {
  try {
    console.log('🔍 Fetching role for user:', userId);

    // PRIORITY 1: Use the new security definer function
    try {
      const { data, error } = await supabase.rpc('get_current_user_role');
      
      if (!error && data && isValidRole(data)) {
        console.log('✅ Found role using security definer function:', data);
        return data as UserRole;
      }
      
      if (error) {
        console.warn('Security definer function error:', error.message);
      }
    } catch (err) {
      console.warn('Could not call security definer function:', err);
    }

    // PRIORITY 2: Fallback to direct user_roles query
    try {
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role, status')
        .eq('user_id', userId)
        .eq('status', 'approved')
        .maybeSingle();

      if (!roleError && roleData?.role && isValidRole(roleData.role)) {
        console.log('✅ Found role in user_roles (fallback):', roleData.role);
        return roleData.role as UserRole;
      }
      
      if (roleError) {
        console.warn('user_roles query error:', roleError.message);
      }
    } catch (roleErr) {
      console.warn('Could not fetch from user_roles:', roleErr);
    }

    // PRIORITY 3: Fallback to profiles table for backward compatibility
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (!profileError && profileData?.role && isValidRole(profileData.role)) {
        console.log('✅ Found role in profiles (backward compatibility):', profileData.role);
        
        // Auto-create the missing user_roles entry for future consistency
        try {
          const { error: upsertError } = await supabase
            .from('user_roles')
            .upsert({
              user_id: userId,
              role: profileData.role as UserRole,
              status: 'approved'
            }, {
              onConflict: 'user_id,role'
            });
            
          if (upsertError) {
            console.warn('Could not auto-create user_roles entry:', upsertError.message);
          } else {
            console.log('🔧 Auto-created missing user_roles entry');
          }
        } catch (createErr) {
          console.warn('Could not auto-create user_roles entry:', createErr);
        }
        
        return profileData.role as UserRole;
      }
      
      if (profileError) {
        console.warn('profiles query error:', profileError.message);
      }
    } catch (profileErr) {
      console.warn('Could not fetch from profiles:', profileErr);
    }

    // PRIORITY 4: Use auth metadata as last resort only for known super admin
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.role && user.id === 'af6ad2ce-be6c-4620-a440-867c52d66918') {
        console.log('✅ Found role in metadata for known super admin:', user.user_metadata.role);
        return 'super_admin' as UserRole;
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
