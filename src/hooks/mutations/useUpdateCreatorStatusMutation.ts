
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useUpdateCreatorInvitationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectCreatorId,
      status,
      responseDate,
      contractSignedDate,
    }: {
      projectCreatorId: string;
      status: 'accepted' | 'declined' | 'contracted' | 'in_progress' | 'submitted' | 'completed' | 'cancelled';
      responseDate?: string;
      contractSignedDate?: string;
    }) => {
      const updateData: any = {
        status,
        response_date: responseDate || (status !== 'invited' ? new Date().toISOString() : undefined),
      };

      if (contractSignedDate) {
        updateData.contract_signed_date = contractSignedDate;
      }

      const { data, error } = await supabase
        .from('project_creators')
        .update(updateData)
        .eq('id', projectCreatorId)
        .select()
        .single();

      if (error) {
        console.error('Error updating creator status:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success('Creator status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['project-creators', data.project_id] });
    },
    onError: (error) => {
      console.error('Failed to update creator status:', error);
      toast.error('Failed to update creator status. Please try again.');
    },
  });
};
