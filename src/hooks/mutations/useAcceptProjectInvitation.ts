
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAcceptProjectInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      invitationId,
      action,
      notes,
    }: {
      invitationId: string;
      action: 'accept' | 'decline';
      notes?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('accept-project-invitation', {
        body: {
          invitation_id: invitationId,
          action,
          notes,
        },
      });

      if (error) {
        console.error('Error invoking accept-project-invitation:', error);
        throw error;
      }

      if (!data?.success) {
        throw new Error(data?.error || `Failed to ${action} invitation`);
      }

      return data;
    },
    onSuccess: (data, variables) => {
      const actionText = variables.action === 'accept' ? 'accepted' : 'declined';
      toast.success(`Invitation ${actionText}!`, {
        description: data.message
      });
      queryClient.invalidateQueries({ queryKey: ['project-invitations'] });
      queryClient.invalidateQueries({ queryKey: ['creator-deals'] });
    },
    onError: (error, variables) => {
      console.error(`Failed to ${variables.action} invitation:`, error);
      toast.error(`Failed to ${variables.action} invitation`, {
        description: error.message
      });
    },
  });
};
