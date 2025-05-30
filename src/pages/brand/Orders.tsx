
import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import BrandLayout from '@/components/layouts/BrandLayout';
import OrdersPipeline from '@/components/brand/orders/OrdersPipeline';
import CampaignDetail from '@/components/brand/orders/CampaignDetail';
import OrdersHeader from '@/components/brand/orders/OrdersHeader';
import OrdersSearch from '@/components/brand/orders/OrdersSearch';
import OrdersLoading from '@/components/brand/orders/OrdersLoading';
import { useProjectData } from '@/hooks/useProjectData';
import { useOrderActions } from '@/hooks/useOrderActions';
import { useToast } from '@/hooks/use-toast';
import { OrderStage } from '@/types/orders';

const BrandOrders = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const { toast } = useToast();
  
  const {
    orders,
    activeStage,
    selectedOrder,
    isLoading,
    handleStageChange,
    handleProjectSelect,
    handleCloseProjectDetail,
    refreshProjects
  } = useProjectData();
  
  const { handleMoveStage: moveStage, isProcessing } = useOrderActions();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter orders by search term with proper null checks
  const filteredOrders = orders.filter(order => 
    order?.title?.toLowerCase?.()?.includes(searchTerm.toLowerCase()) || false
  );

  // Handle direct navigation to a specific campaign
  useEffect(() => {
    if (projectId && orders.length > 0 && !selectedOrder) {
      const foundOrder = orders.find(order => order.id === projectId);
      if (foundOrder) {
        handleProjectSelect(foundOrder.id);
      }
    }
  }, [projectId, orders, selectedOrder, handleProjectSelect]);

  // Handle moving an order to a new stage
  const handleMoveStageWrapper = async (id: string, newStage: OrderStage) => {
    const success = await moveStage(id, newStage);
    
    if (success) {
      // Refresh the projects list to get updated data
      refreshProjects();
      
      toast({
        title: "Stage Updated",
        description: "Project has been moved to the next stage."
      });
    }
  };

  if (isLoading) {
    return <OrdersLoading />;
  }

  return (
    <BrandLayout>
      <div className="container mx-auto p-6">
        <OrdersHeader />
        
        <OrdersSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        {selectedOrder ? (
          <CampaignDetail 
            order={selectedOrder} 
            onClose={handleCloseProjectDetail}
            onMoveStage={handleMoveStageWrapper}
          />
        ) : (
          <OrdersPipeline 
            orders={filteredOrders}
            activeStage={activeStage}
            onStageChange={handleStageChange}
            onOrderSelect={handleProjectSelect}
          />
        )}
      </div>
    </BrandLayout>
  );
};

export default BrandOrders;
