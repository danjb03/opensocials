
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
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
        handleProjectSelect(foundOrder.id);
      } else {
        console.log('❌ No order found for project ID:', projectId);
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
                <div>• Projects found: {orders.length}</div>
                <div>• Check the browser console for detailed logs</div>
                <div>• Make sure you have projects created in the Projects page</div>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
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
