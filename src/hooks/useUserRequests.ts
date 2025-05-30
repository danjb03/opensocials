
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRequest } from '@/types/admin';
import { toast } from '@/components/ui/sonner';

export const useUserRequests = (filter: string) => {
  const [userRequests, setUserRequests] = useState<UserRequest[]>([]);

  const fetchUserRequests = async () => {
    try {
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('status', filter);

      if (roleError) throw roleError;
      
      if (!roleData) {
        setUserRequests([]);
        return;
      }
      
      const errors: unknown[] = [];
      const processedRequests: UserRequest[] = await Promise.all(
        roleData.map(async (item) => {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('id', item.user_id)
              .single();

            if (profileError) throw profileError;

            return {
              id: item.id,
              user_id: item.user_id,
              role: item.role,
              status: item.status as 'pending' | 'approved' | 'declined',
              created_at: item.created_at || '',
              profiles: {
                first_name: profileData?.first_name || null,
                last_name: profileData?.last_name || null,
                email: null
              }
            };
          } catch (err) {
            errors.push(err);
            return {
              id: item.id,
              user_id: item.user_id,
              role: item.role,
              status: item.status as 'pending' | 'approved' | 'declined',
              created_at: item.created_at || '',
              profiles: null
            };
          }
        })
      );

      if (errors.length > 0) {
        toast.error('Some profile data could not be fetched');
      }

      setUserRequests(processedRequests);
    } catch (error) {
      toast.error('Error fetching user requests', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const handleUserApproval = async (userId: string, approve: boolean) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ 
          status: approve ? 'approved' : 'declined' 
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success(
        approve ? 'User approved successfully' : 'User request declined'
      );

      fetchUserRequests();
    } catch (error) {
      toast.error('Error processing user request', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  useEffect(() => {
    fetchUserRequests();
  }, [filter]);

  return {
    userRequests,
    handleUserApproval
  };
};
