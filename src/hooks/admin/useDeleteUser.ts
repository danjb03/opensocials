
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.functions.invoke('delete-auth-user', {
        body: { user_id: userId }
      });

      if (error) {
        throw new Error(error.message || 'Failed to delete user');
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch auth users
      queryClient.invalidateQueries({ queryKey: ['auth-users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: Error) => {
      console.error('Error deleting user:', error);
      toast.error(`Failed to delete user: ${error.message}`);
    },
  });
};
