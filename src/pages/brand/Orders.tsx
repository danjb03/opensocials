
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Package, Eye, MessageSquare } from 'lucide-react';
import { useCampaignPipeline } from '@/hooks/brand/useCampaignPipeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CampaignDetail from '@/components/brand/orders/CampaignDetail';

const BrandOrders = () => {
  const navigate = useNavigate();
  const {
    orders,
    isLoading,
    error,
    selectedOrder,
    selectedOrderId,
    handleOrderSelect,
    handleCloseDetail,
    handleMoveStage,
    refetch
  } = useCampaignPipeline();

  // Filter orders that are beyond campaign setup (actual orders)
  const actualOrders = orders.filter(order => 
    order.stage !== 'campaign_setup' && order.stage !== 'creator_selection'
  );

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
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Orders</h2>
          <p className="text-muted-foreground mb-4">We encountered an issue loading your orders.</p>
          <Button onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (stage: string) => {
    switch (stage) {
      case 'contract_payment':
        return 'bg-blue-100 text-blue-800';
      case 'planning_creation':
        return 'bg-yellow-100 text-yellow-800';
      case 'content_performance':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (stage: string) => {
    switch (stage) {
      case 'contract_payment':
        return 'Contract & Payment';
      case 'planning_creation':
        return 'In Progress';
      case 'content_performance':
        return 'Live & Tracking';
      default:
        return stage;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">Orders Management</h1>
          <p className="text-muted-foreground">Manage active campaigns and track content performance</p>
        </div>
        <Button onClick={() => navigate('/brand/campaigns')} variant="outline">
          <Package className="h-4 w-4 mr-2" />
          View All Campaigns
        </Button>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto border shadow-lg">
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

      {/* Orders Grid */}
      {actualOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actualOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{order.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {order.creators.length} creator{order.creators.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.stage)}>
                    {getStatusLabel(order.stage)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-medium">${order.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{order.progress}%</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleOrderSelect(order.id)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  {order.stage === 'content_performance' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/brand/campaign-review/${order.id}`)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Review Content
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Active Orders</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any active orders yet. Create campaigns to start working with creators.
            </p>
            <Button onClick={() => navigate('/brand/campaigns')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BrandOrders;
