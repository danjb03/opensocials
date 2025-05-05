
import { useState } from 'react';
import BrandLayout from '@/components/layouts/BrandLayout';
import OrdersPipeline from '@/components/brand/orders/OrdersPipeline';
import CampaignDetail from '@/components/brand/orders/CampaignDetail';
import OrdersHeader from '@/components/brand/orders/OrdersHeader';
import OrdersSearch from '@/components/brand/orders/OrdersSearch';
import OrdersLoading from '@/components/brand/orders/OrdersLoading';
import { useOrderManagement } from '@/hooks/useOrderManagement';

const BrandOrders = () => {
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
  
  // Filter orders by search term
  const filteredOrders = orders.filter(order => 
    order.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
