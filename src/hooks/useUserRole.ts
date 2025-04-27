
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import type { UserRole } from '@/lib/auth';

export const useUserRole = (userId: string | undefined) => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!userId) {
        setRole(null);
        setStatus(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role, status')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user role:', error);
          toast.error('Failed to fetch user role');
          return;
        }

        if (data && data.status === 'approved') {
          setRole(data.role as UserRole);
          setStatus(data.status);
        } else {
          setRole(null);
          setStatus(data?.status || null);
          
          if (data?.status === 'pending') {
            toast.info('Your account is pending approval');
          }
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('An error occurred while fetching role');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, [userId]);

  return { role, status, isLoading };
};
