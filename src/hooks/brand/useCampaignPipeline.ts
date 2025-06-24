
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { Order, OrderStage } from '@/types/orders';
import { projectToOrderSync } from '@/utils/orderUtils';

export const useCampaignPipeline = () => {
  const { user } = useUnifiedAuth();
  const [activeStage, setActiveStage] = useState<OrderStage>('campaign_setup');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Fetch and transform campaigns to orders
  const { data: orders = [], isLoading, error, refetch } = useQuery({
    queryKey: ['brand-campaigns-pipeline', user?.id],
    queryFn: async (): Promise<Order[]> => {
      if (!user?.id) return [];

      try {
        // Fetch from both tables
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

        // Transform to unified format
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

        return allProjects.map(project => projectToOrderSync(project));
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        return [];
      }
    },
    enabled: !!user?.id
  });

  const handleStageChange = (newStage: OrderStage) => {
    setActiveStage(newStage);
  };

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const handleCloseDetail = () => {
    setSelectedOrderId(null);
  };

  const handleMoveStage = async (orderId: string, newStage: OrderStage) => {
    try {
      // Update stage in database
      const { error } = await supabase
        .from('projects_new')
        .update({ review_stage: newStage })
        .eq('id', orderId);

      if (error) {
        // Fallback to legacy table
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

  const selectedOrder = selectedOrderId 
    ? orders.find(order => order.id === selectedOrderId) 
    : null;

  return {
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
  };
};
