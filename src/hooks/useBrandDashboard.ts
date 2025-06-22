
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from '@/components/ui/sonner';
import { orderStageLabels, OrderStage } from '@/types/orders';
import { mapProjectStatusToOrderStage } from '@/utils/orderUtils';

export const useBrandDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [todoItems, setTodoItems] = useState([]);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // 1. Fetch projects for this brand directly from Supabase
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('brand_id', user.id);
          
        if (projectsError) throw projectsError;

        // 2. Fetch draft campaigns from projects_new table
        const { data: draftCampaigns, error: draftError } = await supabase
          .from('projects_new')
          .select('*')
          .eq('brand_id', user.id)
          .eq('status', 'draft');

        if (draftError) throw draftError;

        // 3. Fetch project drafts from project_drafts table
        const { data: projectDrafts, error: draftsError } = await supabase
          .from('project_drafts')
          .select('*')
          .eq('brand_id', user.id);

        if (draftsError) throw draftsError;
        
        // Set projects data
        setProjects(projectsData || []);
        
        // 4. Generate todo items based on projects and their current stages
        const allTodos = [];
        
        // Add todos for draft campaigns that need completion
        draftCampaigns?.forEach(campaign => {
          allTodos.push({
            id: `todo-draft-campaign-${campaign.id}`,
            title: 'Complete campaign setup',
            description: `Finish setting up: ${campaign.name}`,
            priority: 'high' as const,
            type: 'setup' as const,
            route: `/brand/create-campaign?draftId=${campaign.id}`
          });
        });

        // Add todos for incomplete project drafts (from wizard)
        projectDrafts?.forEach(draft => {
          const draftData = draft.draft_data;
          let campaignName = 'Untitled Campaign';
          
          // Safely access the name property from the JSON data
          if (draftData && typeof draftData === 'object' && !Array.isArray(draftData) && 'name' in draftData) {
            const name = (draftData as { name?: string }).name;
            if (typeof name === 'string' && name.trim()) {
              campaignName = name;
            }
          }
          
          allTodos.push({
            id: `todo-draft-wizard-${draft.id}`,
            title: 'Complete campaign draft',
            description: `Finish creating: ${campaignName}`,
            priority: 'high' as const,
            type: 'setup' as const,
            route: '/brand/create-campaign'
          });
        });
        
        // Map of stages and what the next stage would be
        const stageProgression: Record<OrderStage, { next: OrderStage | null, action: string }> = {
          'campaign_setup': { 
            next: 'creator_selection', 
            action: 'Complete campaign setup'
          },
          'creator_selection': { 
            next: 'contract_payment', 
            action: 'Select creators'
          },
          'contract_payment': { 
            next: 'planning_creation', 
            action: 'Complete contract & payment'
          },
          'planning_creation': { 
            next: 'content_performance', 
            action: 'Finalize planning'
          },
          'content_performance': { 
            next: null, 
            action: 'Review performance'
          },
        };
        
        // Add todos for active projects that need next steps
        projectsData?.forEach(project => {
          // Skip draft projects as they're handled above
          if (project.status === 'draft') return;

          // Convert project status to order stage
          const currentStage = mapProjectStatusToOrderStage(project.status);
          const nextStageInfo = stageProgression[currentStage];
          
          if (nextStageInfo && nextStageInfo.next) {
            allTodos.push({
              id: `todo-stage-${project.id}`,
              title: nextStageInfo.action,
              description: `For campaign: ${project.name}`,
              priority: 'medium' as const,
              type: 'action' as const,
              route: `/brand/orders?projectId=${project.id}`
            });
          }
          
          // Add additional todos based on project status
          if (project.status === 'awaiting_approval') {
            allTodos.push({
              id: `todo-approval-${project.id}`,
              title: 'Review pending approval',
              description: `Campaign: ${project.name}`,
              priority: 'high' as const,
              type: 'review' as const,
              route: `/brand/orders?projectId=${project.id}`
            });
          }
        });
        
        setTodoItems(allTodos);
        
      } catch (error: any) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [user]);

  // Calculate project stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => 
    p.status === 'active' || p.status === 'in_progress' || p.status === 'creators_assigned'
  ).length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;

  return {
    isLoading,
    projects,
    todoItems,
    projectStats: {
      totalProjects,
      activeProjects,
      completedProjects
    }
  };
};
