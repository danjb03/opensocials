
import { Project } from '@/types/projects';
import { ProjectFilters } from './useProjectFilters';

export const useProjectFiltering = (rawProjects: Project[], filters: ProjectFilters) => {
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

  return filteredProjects;
};
