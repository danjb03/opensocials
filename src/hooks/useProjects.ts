
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/types/projects';
import { useAuth } from '@/lib/auth';
import { useScalableQuery } from '@/hooks/useScalableQuery';

export type ProjectFilters = {
  campaignTypes: string[];
  platforms: string[];
  campaignName: string;
  startMonth: string | null;
};

export const useProjects = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Define filters state
  const [filters, setFilters] = useState<ProjectFilters>({
    campaignTypes: [],
    platforms: [],
    campaignName: '',
    startMonth: null
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch projects with scalable query system
  const { data: projects = [], isLoading, error, refetch } = useScalableQuery<Project[]>({
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

        // Filter out any invalid entries and validate project structure
        const validProjects: Project[] = [];
        
        for (const item of projectsData) {
          // Skip null, undefined, or non-object items
          if (!item || typeof item !== 'object') {
            continue;
          }

          // Skip error objects - explicit type check and assertion
          if ('error' in (item as Record<string, any>)) {
            continue;
          }

          // Type-safe validation - now TypeScript knows item is a valid object
          const projectItem = item as Record<string, any>;
          
          if (typeof projectItem.id === 'string' &&
              typeof projectItem.name === 'string' &&
              typeof projectItem.campaign_type === 'string') {
            
            // Cast to Project after validation
            validProjects.push(projectItem as Project);
          }
        }

        // Apply client-side filtering for complex filters
        let filteredProjects = validProjects;

        // Apply campaign type filter
        if (filters.campaignTypes.length > 0) {
          filteredProjects = filteredProjects.filter((project) => 
            project.campaign_type && filters.campaignTypes.includes(project.campaign_type)
          );
        }
        
        // Apply platforms filter
        if (filters.platforms.length > 0) {
          filteredProjects = filteredProjects.filter((project) => 
            project.platforms && Array.isArray(project.platforms) && 
            filters.platforms.some(platform => project.platforms.includes(platform))
          );
        }
        
        // Apply campaign name filter
        if (filters.campaignName) {
          filteredProjects = filteredProjects.filter((project) =>
            project.name && project.name.toLowerCase().includes(filters.campaignName.toLowerCase())
          );
        }
        
        // Apply start month filter
        if (filters.startMonth) {
          const [year, month] = filters.startMonth.split('-');
          filteredProjects = filteredProjects.filter((project) => {
            if (!project.start_date) return false;
            const projectDate = new Date(project.start_date);
            return projectDate.getFullYear() === parseInt(year) && 
                   (projectDate.getMonth() + 1) === parseInt(month);
          });
        }
        
        console.log('📊 Filtered projects:', filteredProjects.length, 'projects');
        
        return filteredProjects;
      } catch (error) {
        console.error('❌ Error fetching projects:', error);
        return [];
      }
    },
    staleTime: 5000,
    refetchOnWindowFocus: true,
  });

  // Handle error
  if (error) {
    console.error('❌ Error in useProjects:', error);
    toast({
      title: "Error",
      description: "Failed to load projects. Please try again.",
      variant: "destructive",
    });
  }

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

  return {
    projects,
    isLoading,
    filters,
    isDialogOpen,
    setIsDialogOpen,
    handleFiltersChange,
    handleProjectCreated,
  };
};
