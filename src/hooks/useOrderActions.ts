
import { useState } from 'react';
import { OrderStage } from '@/types/orders';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useOrderActions = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleMoveStage = async (id: string, newStage: OrderStage) => {
    try {
      setIsProcessing(true);
      
      // Update project status in database
      const { error } = await supabase
        .from('projects')
        .update({ status: newStage })
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
