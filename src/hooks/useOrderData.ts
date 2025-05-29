
import { useState } from 'react';
import { useScalableQuery } from './useScalableQuery';
import { Order, OrderStage } from '@/types/orders';
import { Project } from '@/types/projects';
import { projectToOrder } from '@/utils/orderUtils';

export const useOrderData = () => {
  const [activeStage, setActiveStage] = useState<OrderStage>('campaign_setup');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Fetch projects and transform to orders
  const { data: projects = [], isLoading, error, refetch } = useScalableQuery<Project[]>({
    baseKey: ['projects'],
    tableName: 'projects',
    selectColumns: '*',
    additionalFilters: {},
  });

  // Transform projects to orders
  const orders: Order[] = projects.map(project => projectToOrder(project));

  // Get selected order
  const selectedOrder = selectedOrderId 
    ? orders.find(order => order.id === selectedOrderId) || null
    : null;

  // Get orders for specific stage
  const getOrdersByStage = (stage: OrderStage) => {
    return orders.filter(order => order.stage === stage);
  };

  // Move order to different stage
  const moveOrderToStage = (orderId: string, newStage: OrderStage) => {
    // This would update the project status in the database
    console.log(`Moving order ${orderId} to stage ${newStage}`);
  };

  const handleStageChange = (stage: OrderStage) => {
    setActiveStage(stage);
    setSelectedOrderId(null); // Clear selection when changing stages
  };

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const handleCloseOrderDetail = () => {
    setSelectedOrderId(null);
  };

  // Expose refetch as refreshOrders for compatibility
  const refreshOrders = () => {
    console.log('🔄 Refreshing orders data');
    refetch();
  };

  return {
    orders,
    activeStage,
    selectedOrder,
    isLoading,
    error,
    getOrdersByStage,
    moveOrderToStage,
    handleStageChange,
    handleOrderSelect,
    handleCloseOrderDetail,
    refreshOrders, // Add this for compatibility
    setOrders: (newOrders: Order[]) => {
      console.log('Note: Direct order updates will not persist to the database.');
      // This is a legacy interface - actual updates should go through the projects table
    },
  };
};
