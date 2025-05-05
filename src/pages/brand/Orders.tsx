
import { useState } from 'react';
import BrandLayout from '@/components/layouts/BrandLayout';
import OrdersPipeline from '@/components/brand/orders/OrdersPipeline';
import CampaignDetail from '@/components/brand/orders/CampaignDetail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useOrderManagement } from '@/hooks/useOrderManagement';
import { Search, PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  // Filter orders by search term
  const filteredOrders = orders.filter(order => 
    order.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCampaign = () => {
    navigate('/brand/projects/create');
  };

  if (isLoading) {
    return (
      <BrandLayout>
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-40" />
          </div>
          <Skeleton className="h-12 w-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </BrandLayout>
    );
  }

  return (
    <BrandLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Campaign Management</h1>
            <p className="text-gray-500">Manage and track your campaigns through each stage</p>
          </div>
          <Button onClick={handleCreateCampaign}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search campaigns..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
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
