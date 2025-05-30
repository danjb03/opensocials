import type { UserRole } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

export const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
  // Try user_roles table first
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role, status')
    .eq('user_id', userId)
    .eq('status', 'approved')
    .maybeSingle();

  if (roleError) {
    console.error('Error fetching user role from table:', roleError);
  } else if (roleData) {
    return roleData.role as UserRole;
  }

  // Fallback to profiles table
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (profileError) {
    console.error('Error fetching user role from profiles:', profileError);
  } else if (profileData?.role) {
    return profileData.role as UserRole;
  }

  // Last fallback to user metadata
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.role) {
    return user.user_metadata.role as UserRole;
  }

  return null;
};
