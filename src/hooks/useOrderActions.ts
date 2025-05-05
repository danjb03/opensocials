
import { useState } from 'react';
import { OrderStage } from '@/types/orders';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useOrderActions = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Map order stage to project status in the database
  const mapOrderStageToProjectStatus = (stage: OrderStage): string => {
    switch(stage) {
      case 'campaign_setup':
        return 'new';
      case 'creator_selection':
        return 'under_review';
      case 'contract_payment':
        return 'creators_assigned';
      case 'planning_creation':
        return 'in_progress';
      case 'content_performance':
        return 'completed';
      default:
        return 'new';
    }
  };

  const handleMoveStage = async (id: string, newStage: OrderStage): Promise<boolean> => {
    try {
      setIsProcessing(true);
      
      const newStatus = mapOrderStageToProjectStatus(newStage);
      
      // Update project status in database
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Campaign Stage Updated",
        description: `Campaign moved to ${newStage.replace('_', ' ')} stage.`
      });
      
      return true;
    } catch (error) {
      console.error('Error moving campaign stage:', error);
      toast({
        title: "Failed to Update Stage",
        description: "There was an error updating the campaign stage.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleMoveStage
  };
};
