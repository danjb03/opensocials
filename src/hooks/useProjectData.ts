
import { 
  useProjectFilters, 
  useProjectQuery, 
  useProjectTransforms, 
  useProjectFiltering, 
  useProjectActions,
  type ProjectFilters 
} from './projects';

export type { ProjectFilters };
export type ProjectViewMode = 'table' | 'pipeline' | 'campaigns';

/**
 * Unified Project Data Hook - Single source of truth for all project data
 */
export const useProjectData = () => {
  // Use smaller, focused hooks
  const { filters, handleFiltersChange } = useProjectFilters();
  const projectQuery = useProjectQuery();
  const { data: rawProjectData, isLoading, error, refetch } = projectQuery;
  
  // Extract projects array from the data structure
  const rawProjects = Array.isArray(rawProjectData) ? rawProjectData : (rawProjectData?.projects || []);
  
  const filteredProjects = useProjectFiltering(rawProjects, filters);
  const { orders, campaignRows } = useProjectTransforms(filteredProjects);
  const {
    activeStage,
    selectedProjectId,
    isDialogOpen,
    handleProjectCreated,
    handleStageChange,
    handleProjectSelect,
    handleCloseProjectDetail,
    refreshProjects,
    setIsDialogOpen,
    setSelectedProjectId,
    setActiveStage
  } = useProjectActions(refetch);

  // Get selected project/order
  const selectedProject = selectedProjectId 
    ? filteredProjects.find(project => project.id === selectedProjectId) || null
    : null;
  
  const selectedOrder = selectedProjectId 
    ? orders.find(order => order.id === selectedProjectId) || null
    : null;

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
