
import { Order, OrderStage } from '@/types/orders';
import { useToast } from '@/hooks/use-toast';
import { getStageProgress } from '@/utils/orderUtils';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useOrderActions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Handle moving order to a different stage
  const { mutate } = useMutation({
    mutationFn: async ({ id, newStage }: { id: string, newStage: OrderStage }) => {
      // Map order stage back to project status
      let projectStatus: string;
      switch (newStage) {
        case 'campaign_setup':
          projectStatus = 'new';
          break;
        case 'creator_selection':
          projectStatus = 'under_review';
          break;
        case 'contract_payment':
          projectStatus = 'creators_assigned';
          break;
        case 'planning_creation':
          projectStatus = 'in_progress';
          break;
        case 'content_performance':
          projectStatus = 'completed';
          break;
        default:
          projectStatus = 'new';
      }

      // Update the project in Supabase
      const { error } = await supabase
        .from('projects')
        .update({ status: projectStatus })
        .eq('id', id);

      if (error) {
        throw error;
      }

      return { id, newStage };
    },
    onSuccess: ({ id, newStage }) => {
      toast({
        title: 'Campaign updated',
        description: `Campaign moved to ${newStage.replace('_', ' ')}`,
      });
      
      // Invalidate and refetch campaigns data
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
    onError: (error) => {
      console.error('Error updating campaign stage:', error);
      toast({
        title: 'Error',
        description: 'Failed to update campaign stage',
        variant: 'destructive',
      });
    }
  });

  // Create a wrapper function with the expected signature
  const handleMoveStage = (id: string, newStage: OrderStage) => {
    mutate({ id, newStage });
  };

  return {
    handleMoveStage
  };
};
