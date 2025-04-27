import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import type { UserRole } from '@/lib/auth';

export const useUserRole = (userId: string | undefined) => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      console.log('No userId yet. Skipping role fetch.');
      setRole(null);
      setStatus(null);
      setIsLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role, status')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user role:', error.message);
          toast.error('Failed to fetch user role.');
          return;
        }

        if (data) {
          if (data.status === 'approved') {
            setRole(data.role as UserRole);
            setStatus('approved');
          } else {
            setRole(null);
            setStatus(data.status || null);

            if (data.status === 'pending') {
              toast.info('Your account is pending approval.');
            } else if (data.status === 'declined') {
              toast.error('Your account has been declined.');
            }
          }
        } else {
          console.error('No role data found for user.');
          toast.error('No role assigned.');
        }
      } catch (err) {
        console.error('Unexpected error fetching role:', err);
        toast.error('Unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, [userId]);

  return { role, status, isLoading };
};


