
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/projects';
import { Order, OrderStage } from '@/types/orders';
import { projectToOrderSync } from '@/utils/orderUtils';

export type ProjectFilters = {
  campaignTypes: string[];
  platforms: string[];
  campaignName: string;
  startMonth: string | null;
};

export type ProjectViewMode = 'table' | 'pipeline' | 'campaigns';

/**
 * Unified Project Data Hook - Single source of truth for all project data
 */
export const useProjectData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Unified state management
  const [filters, setFilters] = useState<ProjectFilters>({
    campaignTypes: [],
    platforms: [],
    campaignName: '',
    startMonth: null
  });
  
  const [activeStage, setActiveStage] = useState<OrderStage>('campaign_setup');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Simplified query using standard useQuery
  const { data: rawProjects = [], isLoading, error, refetch } = useQuery({
    queryKey: ['projects', user?.id, filters],
    queryFn: async (): Promise<Project[]> => {
      if (!user?.id) {
        return [];
      }
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('brand_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching projects:', error);
          throw error;
        }

        // Transform and validate projects
        const validProjects: Project[] = (data || []).map((item: any) => ({
          id: item.id,
          name: item.name || '',
          campaign_type: item.campaign_type || '',
          start_date: item.start_date || '',
          end_date: item.end_date || '',
          budget: Number(item.budget) || 0,
          currency: item.currency || 'USD',
          platforms: Array.isArray(item.platforms) ? item.platforms : [],
          status: item.status || 'draft',
          is_priority: Boolean(item.is_priority)
        }));

        return validProjects;
      } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
      }
    },
    enabled: !!user?.id,
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });

  // Handle error
  if (error) {
    toast({
      title: "Error",
      description: "Failed to load projects. Please try again.",
      variant: "destructive",
    });
  }

  // Apply client-side filtering
  const filteredProjects = rawProjects.filter((project) => {
    // Campaign type filter
    if (filters.campaignTypes.length > 0 && 
        !filters.campaignTypes.includes(project.campaign_type)) {
      return false;
    }
    
    // Platforms filter
    if (filters.platforms.length > 0 && 
        !filters.platforms.some(platform => project.platforms.includes(platform))) {
      return false;
    }
    
    // Campaign name filter
    if (filters.campaignName && 
        !project.name.toLowerCase().includes(filters.campaignName.toLowerCase())) {
      return false;
    }
    
    // Start month filter
    if (filters.startMonth) {
      const [year, month] = filters.startMonth.split('-');
      const projectDate = new Date(project.start_date);
      if (projectDate.getFullYear() !== parseInt(year) || 
          (projectDate.getMonth() + 1) !== parseInt(month)) {
        return false;
      }
    }
    
    return true;
  });

  // Transform projects to orders for pipeline view
  const orders: Order[] = filteredProjects.map(project => projectToOrderSync(project));

  // Transform projects to campaign rows for dashboard
  const campaignRows = filteredProjects.map((project) => ({
    project_id: project.id,
    project_name: project.name,
    project_status: project.status,
    start_date: project.start_date || null,
    end_date: project.end_date || null,
    budget: project.budget,
    currency: project.currency,
    deal_id: null,
    deal_status: null,
    deal_value: null,
    creator_name: null,
    avatar_url: null,
    engagement_rate: null,
    primary_platform: null
  }));

  // Get selected project/order
  const selectedProject = selectedProjectId 
    ? filteredProjects.find(project => project.id === selectedProjectId) || null
    : null;
  
  const selectedOrder = selectedProjectId 
    ? orders.find(order => order.id === selectedProjectId) || null
    : null;

  // Action handlers
  const handleFiltersChange = (newFilters: ProjectFilters) => {
    setFilters(newFilters);
  };

  const handleProjectCreated = (newProject: any) => {
    setIsDialogOpen(false);
    
    toast({
      title: "Project created",
      description: `${newProject.name} has been successfully created.`,
    });

    // Force a manual refetch to ensure we see the new project immediately
    setTimeout(() => {
      refetch();
    }, 1000);
  };

  const handleStageChange = (stage: OrderStage) => {
    setActiveStage(stage);
    setSelectedProjectId(null);
  };

  const handleProjectSelect = (id: string) => {
    setSelectedProjectId(id);
  };

  const handleCloseProjectDetail = () => {
    setSelectedProjectId(null);
  };

  const refreshProjects = () => {
    refetch();
  };

  return {
    // Raw data
    projects: filteredProjects,
    orders,
    campaignRows,
    
    // UI state
    isLoading,
    error,
    filters,
    activeStage,
    selectedProject,
    selectedOrder,
    selectedProjectId,
    isDialogOpen,
    
    // Actions
    handleFiltersChange,
    handleProjectCreated,
    handleStageChange,
    handleProjectSelect,
    handleCloseProjectDetail,
    refreshProjects,
    setIsDialogOpen,
    setSelectedProjectId,
    setActiveStage,
    
    // Legacy compatibility
    setOrders: () => {},
  };
};
