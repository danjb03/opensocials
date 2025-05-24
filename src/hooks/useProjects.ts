import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/types/projects';
import { useAuth } from '@/lib/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export type ProjectFilters = {
  campaignTypes: string[];
  platforms: string[];
  campaignName: string;
  startMonth: string | null;
};

export const useProjects = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Define filters state
  const [filters, setFilters] = useState<ProjectFilters>({
    campaignTypes: [],
    platforms: [],
    campaignName: '',
    startMonth: null
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch projects with React Query for better synchronization
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects', user?.id, filters],
    queryFn: async () => {
      if (!user) return [];
      
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
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data as Project[];
    },
    enabled: !!user,
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  // Set up real-time subscription for projects changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('projects-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'projects',
        filter: `brand_id=eq.${user.id}`
      }, (payload) => {
        console.log('Project change detected:', payload);
        // Invalidate and refetch projects data
        queryClient.invalidateQueries({ queryKey: ['projects', user.id] });
        // Also invalidate campaigns data to keep both views in sync
        queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  // Handle error
  useEffect(() => {
    if (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleFiltersChange = (newFilters: ProjectFilters) => {
    setFilters(newFilters);
  };

  const handleProjectCreated = (newProject: any) => {
    // Invalidate queries to refresh data
    queryClient.invalidateQueries({ queryKey: ['projects', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    
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
