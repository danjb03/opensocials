
import { useState, useEffect } from 'react';
import { getUserRole } from '@/utils/getUserRole';
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
        console.log('🔍 useUserRole fetching role for:', userId);
        const userRole = await getUserRole(userId);
        
        if (userRole) {
          console.log('✅ useUserRole resolved role:', userRole);
          setRole(userRole);
        } else {
          console.warn('❌ useUserRole: No role found');
          setRole(null);
        }
      } catch (err) {
        console.error('❌ useUserRole error:', err);
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
