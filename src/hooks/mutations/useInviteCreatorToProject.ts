
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useInviteCreatorToProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      creatorId,
      agreedAmount,
      currency = 'USD',
      contentRequirements,
      notes,
    }: {
      projectId: string;
      creatorId: string;
      agreedAmount?: number;
      currency?: string;
      contentRequirements?: any;
      notes?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('invite-creator-to-project', {
        body: {
          project_id: projectId,
          creator_id: creatorId,
          agreed_amount: agreedAmount,
          currency,
          content_requirements: contentRequirements,
          notes,
        },
      });

      if (error) {
        console.error('Error invoking invite-creator-to-project:', error);
        throw error;
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to send invitation');
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success('Creator invitation sent!', {
        description: data.message
      });
      queryClient.invalidateQueries({ queryKey: ['project-creators'] });
    },
    onError: (error) => {
      console.error('Failed to invite creator:', error);
      toast.error('Failed to send invitation', {
        description: error.message
      });
    },
  });
};
