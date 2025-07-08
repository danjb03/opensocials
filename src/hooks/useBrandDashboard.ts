
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { toast } from '@/components/ui/sonner';
import { orderStageLabels, OrderStage } from '@/types/orders';
import { mapProjectStatusToOrderStage } from '@/utils/orderUtils';

export const useBrandDashboard = () => {
  const { user } = useUnifiedAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [todoItems, setTodoItems] = useState([]);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        console.log('🔍 useBrandDashboard - Loading data for user:', user.id);
        
        // 1. Fetch projects from both tables
        const [projectsResult, newProjectsResult, draftsResult] = await Promise.allSettled([
          supabase
            .from('projects')
            .select('*')
            .eq('brand_id', user.id),
          supabase
            .from('projects_new')
            .select('*')
            .eq('brand_id', user.id),
          supabase
            .from('project_drafts')
            .select('*')
            .eq('brand_id', user.id)
        ]);

        let allProjects = [];
        
        // Handle legacy projects
        if (projectsResult.status === 'fulfilled' && projectsResult.value.data) {
          allProjects = [...allProjects, ...projectsResult.value.data];
          console.log('✅ useBrandDashboard - Loaded', projectsResult.value.data.length, 'legacy projects');
        } else if (projectsResult.status === 'rejected') {
          console.error('❌ useBrandDashboard - Error loading legacy projects:', projectsResult.reason);
        }

        // Handle new projects
        if (newProjectsResult.status === 'fulfilled' && newProjectsResult.value.data) {
          allProjects = [...allProjects, ...newProjectsResult.value.data];
          console.log('✅ useBrandDashboard - Loaded', newProjectsResult.value.data.length, 'new projects');
        } else if (newProjectsResult.status === 'rejected') {
          console.error('❌ useBrandDashboard - Error loading new projects:', newProjectsResult.reason);
        }

        // Set projects data
        setProjects(allProjects);
        
        // 4. Generate todo items based on projects and their current stages
        const allTodos = [];
        
        // Add todos for draft campaigns that need completion
        if (newProjectsResult.status === 'fulfilled' && newProjectsResult.value.data) {
          const draftCampaigns = newProjectsResult.value.data.filter(c => c.status === 'draft');
          
          draftCampaigns.forEach(campaign => {
            allTodos.push({
              id: `todo-draft-campaign-${campaign.id}`,
              title: 'Complete campaign setup',
              description: `Finish setting up: ${campaign.name || 'Untitled Campaign'}`,
              priority: 'high' as const,
              type: 'setup' as const,
              route: `/brand/create-campaign?draftId=${campaign.id}`
            });
          });
        }

        // Add todos for incomplete project drafts (from wizard)  
        if (draftsResult.status === 'fulfilled' && draftsResult.value.data) {
          draftsResult.value.data.forEach(draft => {
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
        }
        
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
        allProjects.forEach(project => {
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
        
        console.log('✅ useBrandDashboard - Loaded dashboard data:', {
          projects: allProjects.length,
          todos: allTodos.length
        });
        
      } catch (error: any) {
        console.error('❌ useBrandDashboard - Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [user?.id]);

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
