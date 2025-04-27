
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import type { UserRole } from '@/lib/auth';

export const useUserRole = (userId: string | undefined) => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch role if we have a valid userId
    if (!userId) {
      setIsLoading(false);
      setRole(null);
      setStatus(null);
      return;
    }

    const fetchRole = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Only fetch the specific fields we need (role and status)
        const { data, error } = await supabase
          .from('user_roles')
          .select('role, status')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user role:', error.message);
          setError(error.message);
          setRole(null);
          setStatus(null);
          return;
        }

        // Process the response data
        if (data) {
          setRole(data.status === 'approved' ? (data.role as UserRole) : null);
          setStatus(data.status || null);
          
          // Show appropriate toast messages based on status
          if (data.status === 'pending') {
            toast.info('Your account is pending approval');
          } else if (data.status === 'declined') {
            toast.error('Your account has been declined');
          }
        } else {
          setRole(null);
          setStatus(null);
        }
      } catch (err) {
        console.error('Unexpected error fetching role:', err);
        setError('Unexpected error occurred');
        setRole(null);
        setStatus(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, [userId]);

  return { role, status, isLoading, error };
};
