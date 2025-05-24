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
      if (!user) {
        console.log('🚫 No user found, returning empty array');
        return [];
      }
      
      console.log('🔍 Fetching projects for user:', user.id);
      console.log('🔍 Applied filters:', filters);
      
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
        console.error('❌ Error fetching projects:', error);
        throw error;
      }
      
      console.log('📊 Fetched projects:', data?.length || 0, 'projects');
      console.log('📋 Project details:', data?.map(p => ({ id: p.id, name: p.name, status: p.status })));
      
      return data as Project[];
    },
    enabled: !!user,
    staleTime: 5000, // Consider data stale after 5 seconds for more frequent updates
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  // Set up real-time subscription for projects changes
  useEffect(() => {
    if (!user) return;

    console.log('🔔 Setting up real-time subscription for projects');

    const channel = supabase
      .channel('projects-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'projects',
        filter: `brand_id=eq.${user.id}`
      }, (payload) => {
        console.log('🔔 Project change detected:', payload);
        console.log('🔔 Event type:', payload.eventType);
        console.log('🔔 New record:', payload.new);
        console.log('🔔 Old record:', payload.old);
        
        // Invalidate ALL related queries to keep both views in sync
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      })
      .subscribe();

    return () => {
      console.log('🔔 Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  // Handle error
  useEffect(() => {
    if (error) {
      console.error('❌ Error in useProjects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleFiltersChange = (newFilters: ProjectFilters) => {
    console.log('🔧 Filters changed:', newFilters);
    setFilters(newFilters);
  };

  const handleProjectCreated = (newProject: any) => {
    console.log('🎉 Project created callback triggered:', newProject);
    
    // Invalidate ALL related queries to refresh data everywhere
    queryClient.invalidateQueries({ queryKey: ['projects'] });
    queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    
    setIsDialogOpen(false);
    
    toast({
      title: "Project created",
      description: `${newProject.name} has been successfully created.`,
    });

    // Force a manual refetch to ensure we see the new project immediately
    setTimeout(() => {
      console.log('🔄 Force refetching projects after creation');
      queryClient.refetchQueries({ queryKey: ['projects'] });
      queryClient.refetchQueries({ queryKey: ['campaigns'] });
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
