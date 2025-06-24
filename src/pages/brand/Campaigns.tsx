
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCampaignPipeline } from '@/hooks/brand/useCampaignPipeline';
import OrdersPipeline from '@/components/brand/orders/OrdersPipeline';
import CampaignDetail from '@/components/brand/orders/CampaignDetail';

const BrandCampaigns = () => {
  const navigate = useNavigate();
  const {
    orders,
    isLoading,
    error,
    activeStage,
    selectedOrder,
    selectedOrderId,
    handleStageChange,
    handleOrderSelect,
    handleCloseDetail,
    handleMoveStage,
    refetch
  } = useCampaignPipeline();

  const handleContinueDraft = (orderId: string) => {
    navigate(`/brand/create-campaign?draft=${orderId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Campaigns</h2>
          <p className="text-muted-foreground mb-4">We encountered an issue loading your campaigns.</p>
          <Button onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">Campaign Pipeline</h1>
          <p className="text-muted-foreground">Manage your campaigns through each stage from setup to completion</p>
        </div>
        <Button onClick={() => navigate('/brand/create-campaign')} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Campaign Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto border shadow-lg">
            <div className="p-6">
              <CampaignDetail
                order={selectedOrder}
                onClose={handleCloseDetail}
                onMoveStage={handleMoveStage}
              />
            </div>
          </div>
        </div>
      )}

      {/* Pipeline View */}
      <OrdersPipeline
        orders={orders}
        activeStage={activeStage}
        onStageChange={handleStageChange}
        onOrderSelect={handleOrderSelect}
      />

      {/* Draft Campaigns Section */}
      {activeStage === 'campaign_setup' && orders.filter(o => o.stage === 'campaign_setup').length > 0 && (
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Draft Campaigns</h3>
              <p className="text-muted-foreground">
                You have draft campaigns that need to be completed. Continue where you left off.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {orders
              .filter(o => o.stage === 'campaign_setup')
              .slice(0, 3)
              .map(order => (
                <Button
                  key={order.id}
                  variant="outline"
                  onClick={() => handleContinueDraft(order.id)}
                  className="h-auto py-3 px-4 text-left"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-medium">Continue "{order.title}"</span>
                  </div>
                </Button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandCampaigns;
