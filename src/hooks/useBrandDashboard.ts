
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
        
        // Set projects data
        setProjects(projectsData || []);
        
        // 2. Generate todo items based on projects and their current stages
        const allTodos = [];
        
        // Map of stages and what the next stage would be
        const stageProgression: Record<OrderStage, { next: OrderStage, action: string }> = {
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
        
        projectsData?.forEach(project => {
          // Convert project status to order stage
          const currentStage = mapProjectStatusToOrderStage(project.status);
          const nextStageInfo = stageProgression[currentStage];
          
          if (nextStageInfo && nextStageInfo.next) {
            allTodos.push({
              id: `todo-stage-${project.id}`,
              projectId: project.id,
              projectName: project.name,
              title: nextStageInfo.action,
              description: `For campaign: ${project.name}`,
              type: 'next_stage',
              currentStage: orderStageLabels[currentStage],
              nextStage: orderStageLabels[nextStageInfo.next]
            });
          }
          
          // Add additional todos based on project status
          if (project.status === 'draft') {
            allTodos.push({
              id: `todo-draft-${project.id}`,
              projectId: project.id,
              projectName: project.name,
              title: 'Complete project setup',
              description: `Draft campaign: ${project.name}`,
              type: 'confirm',
              currentStage: 'Draft',
              nextStage: 'Campaign Setup'
            });
          } else if (project.status === 'awaiting_approval') {
            allTodos.push({
              id: `todo-approval-${project.id}`,
              projectId: project.id,
              projectName: project.name, 
              title: 'Review pending approval',
              description: `Campaign: ${project.name}`,
              type: 'review',
              currentStage: 'Review',
              nextStage: 'Approval'
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
