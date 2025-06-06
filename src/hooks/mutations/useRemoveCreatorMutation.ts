
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useRemoveCreatorFromProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectCreatorId: string) => {
      const { error } = await supabase
        .from('project_creators')
        .delete()
        .eq('id', projectCreatorId);

      if (error) {
        console.error('Error removing creator:', error);
        throw error;
      }

      return projectCreatorId;
    },
    onSuccess: () => {
      toast.success('Creator removed successfully');
      queryClient.invalidateQueries({ queryKey: ['project-creators'] });
    },
    onError: (error) => {
      console.error('Failed to remove creator:', error);
      toast.error('Failed to remove creator. Please try again.');
    },
  });
};
