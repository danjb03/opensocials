
import { useState } from 'react';
import { Order, OrderStage } from '@/types/orders';
import { useToast } from '@/hooks/use-toast';
import { getStageProgress } from '@/utils/orderUtils';
import { useOrderData } from './useOrderData';

export const useOrderActions = () => {
  const { orders, setOrders } = useOrderData();
  const { toast } = useToast();

  // Handle moving order to a different stage
  const handleMoveStage = (id: string, newStage: OrderStage) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === id 
          ? { 
              ...order, 
              stage: newStage,
              progress: getStageProgress(newStage)
            } 
          : order
      )
    );
    
    toast({
      title: 'Campaign updated',
      description: `Campaign moved to ${newStage.replace('_', ' ')}`,
    });
  };

  return {
    handleMoveStage
  };
};
