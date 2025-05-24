
import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import BrandLayout from '@/components/layouts/BrandLayout';
import OrdersPipeline from '@/components/brand/orders/OrdersPipeline';
import CampaignDetail from '@/components/brand/orders/CampaignDetail';
import OrdersHeader from '@/components/brand/orders/OrdersHeader';
import OrdersSearch from '@/components/brand/orders/OrdersSearch';
import OrdersLoading from '@/components/brand/orders/OrdersLoading';
import { useOrderManagement } from '@/hooks/useOrderManagement';

const BrandOrders = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  
  const {
    orders,
    activeStage,
    selectedOrder,
    isLoading,
    handleStageChange,
    handleOrderSelect,
    handleCloseOrderDetail,
    handleMoveStage
  } = useOrderManagement();
  
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
        handleOrderSelect(foundOrder.id);
      }
    }
  }, [projectId, orders, selectedOrder, handleOrderSelect]);

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
            onClose={handleCloseOrderDetail}
            onMoveStage={handleMoveStage}
          />
        ) : (
          <OrdersPipeline 
            orders={filteredOrders}
            activeStage={activeStage}
            onStageChange={handleStageChange}
            onOrderSelect={handleOrderSelect}
          />
        )}
      </div>
    </BrandLayout>
  );
};

export default BrandOrders;
