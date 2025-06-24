
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import OrdersPipeline from '@/components/brand/orders/OrdersPipeline';
import CampaignDetail from '@/components/brand/orders/CampaignDetail';
import { Order, OrderStage } from '@/types/orders';
import { projectToOrderSync } from '@/utils/orderUtils';

const BrandCampaigns = () => {
  const navigate = useNavigate();
  const { user } = useUnifiedAuth();
  const [activeStage, setActiveStage] = useState<OrderStage>('campaign_setup');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Fetch campaigns and transform to orders format
  const { data: orders = [], isLoading, error, refetch } = useQuery({
    queryKey: ['brand-campaigns-orders', user?.id],
    queryFn: async (): Promise<Order[]> => {
      if (!user?.id) return [];

      try {
        // Fetch from both new and legacy tables
        const [{ data: newProjects }, { data: legacyProjects }] = await Promise.all([
          supabase
            .from('projects_new')
            .select('*')
            .eq('brand_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('projects')
            .select('*')
            .eq('brand_id', user.id)
            .order('created_at', { ascending: false })
        ]);

        // Transform both data sources to unified format
        const allProjects = [
          ...(newProjects || []).map(project => ({
            id: project.id,
            name: project.name || 'Untitled Campaign',
            description: project.description,
            created_at: project.created_at,
            status: project.review_stage || project.status || 'draft',
            budget: project.budget || 0,
            currency: project.currency || 'USD',
            platforms: project.platforms || [],
            end_date: project.end_date,
            start_date: project.start_date
          })),
          ...(legacyProjects || []).map(project => ({
            id: project.id,
            name: project.name || 'Untitled Campaign',
            description: project.description,
            created_at: project.created_at,
            status: project.status || 'draft',
            budget: project.budget || 0,
            currency: project.currency || 'USD',
            platforms: project.platforms || [],
            end_date: project.end_date,
            start_date: project.start_date
          }))
        ];

        // Transform to Order format using the utility function
        return allProjects.map(project => projectToOrderSync(project));

      } catch (error) {
        console.error('Error fetching campaigns:', error);
        return [];
      }
    },
    enabled: !!user?.id
  });

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const handleCloseDetail = () => {
    setSelectedOrderId(null);
  };

  const handleStageChange = (newStage: OrderStage) => {
    setActiveStage(newStage);
  };

  const handleMoveStage = async (orderId: string, newStage: OrderStage) => {
    try {
      // Update the stage in database
      const { error } = await supabase
        .from('projects_new')
        .update({ review_stage: newStage })
        .eq('id', orderId);

      if (error) {
        // Try legacy table as fallback
        await supabase
          .from('projects')
          .update({ status: newStage })
          .eq('id', orderId);
      }

      // Refresh data
      refetch();
    } catch (error) {
      console.error('Error updating campaign stage:', error);
    }
  };

  const handleContinueDraft = (orderId: string) => {
    navigate(`/brand/create-campaign?draft=${orderId}`);
  };

  // Find selected order
  const selectedOrder = selectedOrderId 
    ? orders.find(order => order.id === selectedOrderId) 
    : null;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Campaigns</h2>
          <p className="text-gray-600 mb-4">We encountered an issue loading your campaigns.</p>
          <Button onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campaign Pipeline</h1>
          <p className="text-muted-foreground">Manage your campaigns through each stage from setup to completion</p>
        </div>
        <Button onClick={() => navigate('/brand/create-campaign')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Campaign Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
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

      {/* Continue Draft Button for Setup Stage */}
      {activeStage === 'campaign_setup' && orders.filter(o => o.stage === 'campaign_setup').length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Draft Campaigns</h3>
          <p className="text-blue-700 mb-4">
            You have draft campaigns that need to be completed. Continue where you left off.
          </p>
          <div className="flex gap-2">
            {orders
              .filter(o => o.stage === 'campaign_setup')
              .slice(0, 3)
              .map(order => (
                <Button
                  key={order.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleContinueDraft(order.id)}
                  className="bg-white hover:bg-blue-50"
                >
                  Continue "{order.title}"
                </Button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandCampaigns;
