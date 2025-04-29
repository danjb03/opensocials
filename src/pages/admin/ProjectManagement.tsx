
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { CampaignTypeFilter } from '@/components/admin/CampaignTypeFilter';
import { ProjectList } from '@/components/admin/ProjectList';
import { Project, ProjectStatus } from '@/types/projects';

const ProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaignTypes, setSelectedCampaignTypes] = useState<string[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchProjects();
  
    // Set up a subscription to project changes
    const channel = supabase
      .channel('public:projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, (payload) => {
        fetchProjects();
      })
      .subscribe();
      
    // Clean up subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    // Refetch projects when filters change
    fetchProjects();
  }, [selectedCampaignTypes]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from('projects').select('*');
      
      // Apply campaign type filters if any selected
      if (selectedCampaignTypes.length > 0) {
        const filterConditions = selectedCampaignTypes.map(type => 
          `campaign_type.ilike.%${type}%`
        );
        
        // Combine with OR conditions
        query = query.or(filterConditions.join(','));
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const updateProjectStatus = async (projectId: string, newStatus: ProjectStatus) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId);

      if (error) {
        throw error;
      }

      toast.success('Project status updated successfully');
      
      // Update local state for immediate UI update
      setProjects(projects.map(project => 
        project.id === projectId ? { ...project, status: newStatus } : project
      ));
    } catch (error) {
      console.error('Error updating project status:', error);
      toast.error('Failed to update project status');
    }
  };

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    updateProjectStatus(projectId, newStatus);
  };

  const handleSuggestCreators = (projectId: string) => {
    toast.info('Creator suggestion functionality coming soon!');
  };

  const handleCampaignTypeFilterChange = (value: string[]) => {
    setSelectedCampaignTypes(value);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Projects Dashboard</h1>
      
      <CampaignTypeFilter 
        selectedCampaignTypes={selectedCampaignTypes}
        onFilterChange={handleCampaignTypeFilterChange}
      />
      
      <ProjectList 
        projects={projects}
        isMobile={isMobile}
        loading={loading}
        onStatusChange={handleStatusChange}
        onSuggestCreators={handleSuggestCreators}
        onRefresh={fetchProjects}
        selectedCampaignTypes={selectedCampaignTypes}
      />
    </div>
  );
};

export default ProjectManagement;
