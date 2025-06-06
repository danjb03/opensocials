
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
      paymentStructure,
      contentRequirements,
      notes,
    }: {
      projectId: string;
      creatorId: string;
      agreedAmount?: number;
      currency?: string;
      paymentStructure?: any;
      contentRequirements?: any;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('project_creators')
        .insert({
          project_id: projectId,
          creator_id: creatorId,
          status: 'invited',
          agreed_amount: agreedAmount,
          currency,
          payment_structure: paymentStructure,
          content_requirements: contentRequirements,
          notes,
        })
        .select()
        .single();

      if (error) {
        console.error('Error inviting creator:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success('Creator invited successfully');
      queryClient.invalidateQueries({ queryKey: ['project-creators', data.project_id] });
    },
    onError: (error) => {
      console.error('Failed to invite creator:', error);
      toast.error('Failed to invite creator. Please try again.');
    },
  });
};
