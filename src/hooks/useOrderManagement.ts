
import { useState, useEffect } from 'react';
import { OrderStage } from '@/types/orders';
import { useOrderData } from './useOrderData';
import { useOrderActions } from './useOrderActions';
import { useToast } from '@/hooks/use-toast';

export const useOrderManagement = () => {
  const [activeStage, setActiveStage] = useState<OrderStage>('campaign_setup');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  const { orders, isLoading, refreshOrders } = useOrderData();
  const { handleMoveStage: moveStage, isProcessing } = useOrderActions();
  const { toast } = useToast();

  // Get selected order
  const selectedOrder = selectedOrderId 
    ? orders.find(order => order.id === selectedOrderId) || null
    : null;

  // Handle stage change
  const handleStageChange = (stage: OrderStage) => {
    setActiveStage(stage);
    setSelectedOrderId(null); // Clear selected order when changing stages
  };

  // Handle order selection
  const handleOrderSelect = (id: string) => {
    setSelectedOrderId(id);
  };

  // Handle closing order detail
  const handleCloseOrderDetail = () => {
    setSelectedOrderId(null);
  };

  // Handle moving an order to a new stage
  const handleMoveStage = async (id: string, newStage: OrderStage) => {
    const success = await moveStage(id, newStage);
    
    if (success) {
      // Refresh the orders list to get updated data
      refreshOrders();
      
      toast({
        title: "Stage Updated",
        description: "Campaign has been moved to the next stage."
      });
    }
  };

  return {
    orders,
    activeStage,
    selectedOrder,
    isLoading,
    isProcessing,
    handleStageChange,
    handleOrderSelect,
    handleCloseOrderDetail,
    handleMoveStage
  };
};
