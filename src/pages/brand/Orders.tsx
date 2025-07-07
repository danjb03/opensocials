
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Package, Eye, MessageSquare, TrendingUp, Clock, Users } from 'lucide-react';
import { useCampaignPipeline } from '@/hooks/brand/useCampaignPipeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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

  const getStatusColor = (stage: string) => {
    switch (stage) {
      case 'contract_payment':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'planning_creation':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'content_performance':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      default:
        return 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20';
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

  const getStatusIcon = (stage: string) => {
    switch (stage) {
      case 'contract_payment':
        return <Clock className="h-4 w-4" />;
      case 'planning_creation':
        return <Users className="h-4 w-4" />;
      case 'content_performance':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-muted rounded-lg w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-md mx-auto mt-32 text-center">
          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-8">
            <h2 className="text-xl font-semibold text-red-400 mb-3">Error Loading Orders</h2>
            <p className="text-muted-foreground mb-6">We encountered an issue loading your orders.</p>
            <Button onClick={() => refetch()} variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/5">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-light text-foreground tracking-tight">Order Management</h1>
              <p className="text-lg text-muted-foreground font-light">
                Monitor active campaigns and track content performance across all creators
              </p>
            </div>
            <Button 
              onClick={() => navigate('/brand/campaigns')} 
              variant="outline" 
              className="border-border hover:bg-muted/50"
            >
              <Package className="h-4 w-4 mr-2" />
              View All Campaigns
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto border border-border shadow-xl">
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {actualOrders.map((order) => {
              const acceptedCreators = order.creators.filter(c => c.status === 'accepted' || c.status === 'completed').length;
              
              return (
                <Card 
                  key={order.id} 
                  className="group hover:shadow-lg hover:shadow-foreground/5 transition-all duration-300 cursor-pointer border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30 hover:border-foreground/20"
                  onClick={() => handleOrderSelect(order.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2 flex-1 min-w-0">
                        <CardTitle className="text-xl font-medium text-foreground truncate group-hover:text-foreground/90">
                          {order.title}
                        </CardTitle>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Users className="h-3 w-3 mr-1.5" />
                          <span>{acceptedCreators} of {order.creators.length} creators active</span>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(order.stage)} font-light px-3 py-1.5 text-xs`}>
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(order.stage)}
                          {getStatusLabel(order.stage)}
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-5">
                    {/* Budget and Progress */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm font-light">Campaign Budget</span>
                        <span className="text-lg font-medium text-foreground">${order.budget.toLocaleString()}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground font-light">Overall Progress</span>
                          <span className="font-medium text-foreground">{order.progress}%</span>
                        </div>
                        <Progress 
                          value={order.progress} 
                          className="h-2 bg-muted/50" 
                        />
                      </div>
                    </div>

                    {/* Platforms */}
                    {order.platformsList.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-muted-foreground text-sm font-light">Platforms</span>
                        <div className="flex flex-wrap gap-1.5">
                          {order.platformsList.slice(0, 3).map((platform) => (
                            <Badge key={platform} variant="secondary" className="text-xs font-light bg-muted/30 text-muted-foreground hover:bg-muted/50">
                              {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </Badge>
                          ))}
                          {order.platformsList.length > 3 && (
                            <Badge variant="secondary" className="text-xs font-light bg-muted/30 text-muted-foreground">
                              +{order.platformsList.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderSelect(order.id);
                        }}
                        className="flex-1 bg-foreground text-background hover:bg-foreground/90 font-light"
                      >
                        <Eye className="h-3 w-3 mr-1.5" />
                        View Details
                      </Button>
                      {order.stage === 'content_performance' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/brand/campaign-review/${order.id}`);
                          }}
                          className="border-border hover:bg-muted/30 font-light"
                        >
                          <MessageSquare className="h-3 w-3 mr-1.5" />
                          Review
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="max-w-md mx-auto mt-32">
            <Card className="border-border bg-card/30 backdrop-blur">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted/20 flex items-center justify-center">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-3">No Active Orders</h3>
                <p className="text-muted-foreground font-light mb-6 leading-relaxed">
                  You don't have any active orders yet. Create campaigns to start working with creators and build your brand presence.
                </p>
                <Button 
                  onClick={() => navigate('/brand/campaigns')}
                  className="bg-foreground text-background hover:bg-foreground/90 font-light"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandOrders;
