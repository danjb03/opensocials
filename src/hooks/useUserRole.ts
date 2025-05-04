
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import type { UserRole } from '@/lib/auth';

export const useUserRole = (userId: string | undefined) => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch role if we have a valid userId
    if (!userId) {
      setIsLoading(false);
      setRole(null);
      return;
    }

    const fetchRole = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch role directly from profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user role:', error.message);
          setError(error.message);
          setRole(null);
          return;
        }

        // Process the response data
        if (data?.role) {
          setRole(data.role as UserRole);
        } else {
          setRole(null);
        }
      } catch (err) {
        console.error('Unexpected error fetching role:', err);
        setError('Unexpected error occurred');
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, [userId]);

  return { role, isLoading, error };
};
