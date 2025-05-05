
import { useState } from 'react';
import { OrderStage } from '@/types/orders';
import { useOrderData } from './useOrderData';
import { useOrderActions } from './useOrderActions';

export const useOrderManagement = () => {
  const [activeStage, setActiveStage] = useState<OrderStage>('campaign_setup');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  const { orders, isLoading } = useOrderData();
  const { handleMoveStage } = useOrderActions();

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

  return {
    orders,
    activeStage,
    selectedOrder,
    isLoading,
    handleStageChange,
    handleOrderSelect,
    handleCloseOrderDetail,
    handleMoveStage
  };
};
