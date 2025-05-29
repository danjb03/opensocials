
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { useScalableQuery } from '@/hooks/useScalableQuery';
import { Project } from '@/types/projects';
import { Order, OrderStage } from '@/types/orders';
import { projectToOrder } from '@/utils/orderUtils';

export type ProjectFilters = {
  campaignTypes: string[];
  platforms: string[];
  campaignName: string;
  startMonth: string | null;
};

export type ProjectViewMode = 'table' | 'pipeline' | 'campaigns';

/**
 * Unified Project Data Hook - Single source of truth for all project data
 * Replaces: useProjects, useOrderData, useCampaigns, and useOrderManagement
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

  console.log('🎯 useProjectData initialized for user:', user?.id);

  // Single query for all project data
  const { data: rawProjects = [], isLoading, error, refetch } = useScalableQuery<Project[]>({
    baseKey: ['projects', filters],
    customQueryFn: async (): Promise<Project[]> => {
      if (!user?.id) {
        console.log('🚫 No user found, returning empty array');
        return [];
      }
      
      console.log('🔍 Fetching projects for user:', user.id);
      console.log('🔍 Applied filters:', filters);
      
      try {
        const projectsData = await import('@/lib/userDataStore').then(({ userDataStore }) => 
          userDataStore.executeUserQuery('projects', '*', {})
        );

        console.log('📊 Raw projects data from database:', projectsData);

        // Validate the response structure
        if (!projectsData || typeof projectsData === 'string') {
          console.error('❌ Invalid projects data:', projectsData);
          return [];
        }

        // Check if it's an error response
        if ((projectsData as any)?.error) {
          console.error('❌ Error in projects data:', projectsData);
          return [];
        }

        // Ensure projectsData is an array
        if (!Array.isArray(projectsData)) {
          console.error('❌ Projects data is not an array:', projectsData);
          return [];
        }

        // Transform and validate projects
        const validProjects: Project[] = [];
        
        for (const item of projectsData) {
          // Skip null, undefined, or non-object items
          if (!item || typeof item !== 'object') {
            continue;
          }

          // Skip error objects
          if ('error' in (item as Record<string, any>)) {
            continue;
          }

          const projectItem = item as Record<string, any>;
          
          // Validate required fields
          if (typeof projectItem.id === 'string' &&
              typeof projectItem.name === 'string' &&
              typeof projectItem.campaign_type === 'string') {
            
            // Transform to match Project type exactly
            const project: Project = {
              id: projectItem.id,
              name: projectItem.name,
              campaign_type: projectItem.campaign_type,
              start_date: projectItem.start_date || '',
              end_date: projectItem.end_date || '',
              budget: Number(projectItem.budget) || 0,
              currency: projectItem.currency || 'USD',
              platforms: Array.isArray(projectItem.platforms) ? projectItem.platforms : [],
              status: projectItem.status || 'draft',
              is_priority: Boolean(projectItem.is_priority)
            };
            
            validProjects.push(project);
          }
        }

        console.log('✅ Projects validated and transformed:', validProjects.length, 'projects');
        return validProjects;
      } catch (error) {
        console.error('❌ Error fetching projects:', error);
        return [];
      }
    },
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });

  // Handle error
  if (error) {
    console.error('❌ Error in useProjectData:', error);
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
  const orders: Order[] = filteredProjects.map(project => projectToOrder(project));

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
    console.log('🔧 Filters changed:', newFilters);
    setFilters(newFilters);
  };

  const handleProjectCreated = (newProject: any) => {
    console.log('🎉 Project created callback triggered:', newProject);
    
    setIsDialogOpen(false);
    
    toast({
      title: "Project created",
      description: `${newProject.name} has been successfully created.`,
    });

    // Force a manual refetch to ensure we see the new project immediately
    setTimeout(() => {
      console.log('🔄 Force refetching projects after creation');
      refetch();
    }, 1000);
  };

  const handleStageChange = (stage: OrderStage) => {
    setActiveStage(stage);
    setSelectedProjectId(null); // Clear selected project when changing stages
  };

  const handleProjectSelect = (id: string) => {
    setSelectedProjectId(id);
  };

  const handleCloseProjectDetail = () => {
    setSelectedProjectId(null);
  };

  const refreshProjects = () => {
    console.log('🔄 Refreshing projects data');
    refetch();
  };

  console.log('🎯 useProjectData final state:', {
    isLoading,
    error: error?.message,
    projectsCount: filteredProjects?.length || 0,
    ordersCount: orders?.length || 0,
    campaignRowsCount: campaignRows?.length || 0
  });

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
    
    // Legacy compatibility (will be removed after refactoring)
    setOrders: () => console.log('Note: Direct state updates will not persist to the database.'),
  };
};
