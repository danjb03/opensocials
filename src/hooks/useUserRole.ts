
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import type { UserRole } from '@/lib/auth';

export const useUserRole = (userId: string | undefined) => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      setRole(null);
      return;
    }

    const fetchRole = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // First check auth metadata - most reliable
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata?.role) {
          console.log('✅ Found role in metadata:', user.user_metadata.role);
          setRole(user.user_metadata.role as UserRole);
          setIsLoading(false);
          return;
        }

        // Try user_roles table (should be less prone to RLS issues)
        try {
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role, status')
            .eq('user_id', userId)
            .eq('status', 'approved')
            .maybeSingle();

          if (!roleError && roleData?.role) {
            console.log('✅ Found approved role in user_roles:', roleData.role);
            setRole(roleData.role as UserRole);
            setIsLoading(false);
            return;
          }
        } catch (roleErr) {
          console.warn('User roles fetch failed:', roleErr);
        }
        
        // Last resort: try profiles table with careful error handling
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .maybeSingle();

          if (profileError) {
            // Check if it's the recursion error
            if (profileError.message?.includes('infinite recursion')) {
              console.warn('⚠️ RLS recursion detected, cannot fetch role from profiles');
              setRole(null);
              setError('Profile access restricted');
            } else {
              console.error('Profile fetch error:', profileError.message);
              setError(profileError.message);
              setRole(null);
            }
            setIsLoading(false);
            return;
          }

          if (profileData?.role) {
            console.log('✅ Found role in profiles:', profileData.role);
            setRole(profileData.role as UserRole);
          } else {
            console.warn('❌ No role found in any table');
            setRole(null);
          }
        } catch (profileErr) {
          console.warn('Profiles table access failed:', profileErr);
          setRole(null);
        }
      } catch (err) {
        console.error('❌ Unexpected error fetching role:', err);
        setError('Failed to fetch user role');
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, [userId]);

  return { role, isLoading, error };
};
