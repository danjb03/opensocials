
import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import BrandLayout from '@/components/layouts/BrandLayout';
import OrdersPipeline from '@/components/brand/orders/OrdersPipeline';
import CampaignDetail from '@/components/brand/orders/CampaignDetail';
import OrdersHeader from '@/components/brand/orders/OrdersHeader';
import OrdersSearch from '@/components/brand/orders/OrdersSearch';
import OrdersLoading from '@/components/brand/orders/OrdersLoading';
import { useOrderManagement } from '@/hooks/useOrderManagement';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

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

  console.log('🎯 BrandOrders component state:', {
    isLoading,
    ordersCount: orders?.length || 0,
    searchTerm,
    projectId,
    selectedOrder: selectedOrder?.id,
    orders: orders?.map(o => ({ id: o.id, title: o.title, stage: o.stage }))
  });
  
  // Filter orders by search term with proper null checks
  const filteredOrders = orders.filter(order => 
    order?.title?.toLowerCase?.()?.includes(searchTerm.toLowerCase()) || false
  );

  console.log('🔍 Filtered orders:', {
    searchTerm,
    totalOrders: orders.length,
    filteredCount: filteredOrders.length,
    filteredOrders: filteredOrders.map(o => ({ id: o.id, title: o.title }))
  });

  // Handle direct navigation to a specific campaign
  useEffect(() => {
    if (projectId && orders.length > 0 && !selectedOrder) {
      console.log('🔗 Looking for project by ID:', projectId, 'in orders:', orders.map(o => o.id));
      const foundOrder = orders.find(order => order.id === projectId);
      if (foundOrder) {
        console.log('✅ Found order for project ID:', foundOrder);
        handleOrderSelect(foundOrder.id);
      } else {
        console.log('❌ No order found for project ID:', projectId);
      }
    }
  }, [projectId, orders, selectedOrder, handleOrderSelect]);

  if (isLoading) {
    console.log('⏳ Showing loading state');
    return <OrdersLoading />;
  }

  // Show debug info when no orders are found
  const showDebugInfo = orders.length === 0;

  return (
    <BrandLayout>
      <div className="container mx-auto p-6">
        <OrdersHeader />
        
        <OrdersSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {showDebugInfo && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-semibold">Debug Information:</div>
                <div>• Loading state: {isLoading ? 'Loading' : 'Loaded'}</div>
                <div>• Orders found: {orders.length}</div>
                <div>• Check the browser console for detailed logs</div>
                <div>• Make sure you have projects created in the Projects page</div>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
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
