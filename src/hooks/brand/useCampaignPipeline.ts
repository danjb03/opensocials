
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

  // Fetch and transform campaigns to orders - only show published campaigns in pipeline
  const { data: orders = [], isLoading, error, refetch } = useQuery({
    queryKey: ['brand-campaigns-pipeline', user?.id],
    queryFn: async (): Promise<Order[]> => {
      if (!user?.id) return [];

      try {
        console.log('🔍 Fetching campaigns for pipeline, user:', user.id);
        
        // Fetch from both tables but only get published campaigns (not drafts)
        const [{ data: newProjects }, { data: legacyProjects }] = await Promise.all([
          supabase
            .from('projects_new')
            .select('*')
            .eq('brand_id', user.id)
            .neq('review_status', 'draft') // Exclude drafts from pipeline
            .order('created_at', { ascending: false }),
          supabase
            .from('projects')
            .select('*')
            .eq('brand_id', user.id)
            .neq('status', 'draft') // Exclude drafts from pipeline
            .order('created_at', { ascending: false })
        ]);

        console.log('📊 Pipeline data fetched:', {
          newProjects: newProjects?.length || 0,
          legacyProjects: legacyProjects?.length || 0
        });

        // Transform to unified format
        const allProjects = [
          ...(newProjects || []).map(project => ({
            id: project.id,
            name: project.name || 'Untitled Campaign',
            description: project.description,
            created_at: project.created_at,
            status: project.review_stage || project.status || 'pending_review',
            budget: project.budget || 0,
            currency: project.currency || 'USD',
            platforms: project.platforms || [],
            end_date: project.end_date,
            start_date: project.start_date,
            review_status: project.review_status
          })),
          ...(legacyProjects || []).map(project => ({
            id: project.id,
            name: project.name || 'Untitled Campaign',
            description: project.description,
            created_at: project.created_at,
            status: project.status || 'pending_review',
            budget: project.budget || 0,
            currency: project.currency || 'USD',
            platforms: project.platforms || [],
            end_date: project.end_date,
            start_date: project.start_date,
            review_status: 'pending_review' // Default for legacy
          }))
        ];

        console.log('📈 Transformed projects:', allProjects.map(p => ({
          id: p.id,
          name: p.name,
          status: p.status,
          review_status: p.review_status
        })));

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
      console.log('🔄 Moving campaign stage:', { orderId, newStage });
      
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
