
import { supabase } from '@/integrations/supabase/client';
import type { UserRole } from '@/lib/auth';

// Clear any stale auth state
export const clearAuthState = () => {
  // Remove standard auth tokens
  try {
    localStorage.removeItem('supabase.auth.token');
    
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Error clearing auth state:', error);
  }
};

// Get user role with improved priority logic and error handling
export const getUserRole = async (userId: string): Promise<UserRole | null> => {
  try {
    console.log('🔍 Getting user role for:', userId);

    // First try the security definer function (most reliable)
    const { data: roleFromFunction, error: functionError } = await supabase
      .rpc('get_current_user_role');

    if (!functionError && roleFromFunction) {
      console.log('✅ Role from security definer function:', roleFromFunction);
      return roleFromFunction as UserRole;
    }

    if (functionError) {
      console.warn('⚠️ Security definer function failed:', functionError);
    }

    // Fallback 1: Check user_roles table directly with error handling
    try {
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role, status')
        .eq('user_id', userId)
        .eq('status', 'approved');

      if (!rolesError && userRoles && userRoles.length > 0) {
        const role = userRoles[0].role as UserRole;
        console.log('✅ Role from user_roles table:', role);
        return role;
      }

      if (rolesError) {
        console.warn('⚠️ user_roles query failed:', rolesError);
      }
    } catch (error) {
      console.warn('⚠️ user_roles table access failed:', error);
    }

    // Fallback 2: Check profiles table
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (!profileError && profile?.role) {
        const role = profile.role as UserRole;
        console.log('✅ Role from profiles table:', role);
        return role;
      }

      if (profileError) {
        console.warn('⚠️ profiles query failed:', profileError);
      }
    } catch (error) {
      console.warn('⚠️ profiles table access failed:', error);
    }

    // Fallback 3: Check auth user metadata
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (!userError && user?.user_metadata?.role) {
        const role = user.user_metadata.role as UserRole;
        console.log('✅ Role from auth metadata:', role);
        return role;
      }
    } catch (error) {
      console.warn('⚠️ auth metadata access failed:', error);
    }

    console.warn('⚠️ No role found for user:', userId);
    return null;
  } catch (error) {
    console.error('❌ Error getting user role:', error);
    return null;
  }
};

// Update user metadata to ensure consistency
export const updateUserMetadata = async (userId: string, role: UserRole) => {
  try {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role }
    });
    
    if (error) {
      console.warn('Failed to update user metadata:', error);
    }
  } catch (error) {
    console.warn('Error updating user metadata:', error);
  }
};
