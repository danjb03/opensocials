
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/types/projects';
import { useAuth } from '@/lib/auth';

export type ProjectFilters = {
  campaignTypes: string[];
  platforms: string[];
  campaignName: string;
  startMonth: string | null;
};

export const useProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Define filters state
  const [filters, setFilters] = useState<ProjectFilters>({
    campaignTypes: [],
    platforms: [],
    campaignName: '',
    startMonth: null
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch projects with filters
  const fetchProjects = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .eq('brand_id', user.id);
      
      // Apply campaign type filter
      if (filters.campaignTypes.length > 0) {
        query = query.in('campaign_type', filters.campaignTypes);
      }
      
      // Apply platforms filter
      if (filters.platforms.length > 0) {
        // For each platform in the filter, check if it exists in the platforms array
        filters.platforms.forEach(platform => {
          query = query.contains('platforms', [platform]);
        });
      }
      
      // Apply campaign name filter
      if (filters.campaignName) {
        query = query.ilike('name', `%${filters.campaignName}%`);
      }
      
      // Apply start month filter
      if (filters.startMonth) {
        const [year, month] = filters.startMonth.split('-');
        query = query.gte('start_date', `${year}-${month}-01`)
                    .lt('start_date', month === '12' 
                      ? `${parseInt(year) + 1}-01-01` 
                      : `${year}-${String(parseInt(month) + 1).padStart(2, '0')}-01`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setProjects(data as Project[]);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch projects when filters change or on component mount
  useEffect(() => {
    fetchProjects();
  }, [filters, user]);

  const handleFiltersChange = (newFilters: ProjectFilters) => {
    setFilters(newFilters);
  };

  const handleProjectCreated = (newProject: any) => {
    fetchProjects(); // Refresh projects from the database
    setIsDialogOpen(false);
    
    toast({
      title: "Project created",
      description: `${newProject.name} has been successfully created.`,
    });
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
