
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '@/types/projects';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseProjectsTableLogicProps {
  projects: Project[];
}

export const useProjectsTableLogic = ({ projects }: UseProjectsTableLogicProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const initialPriorityCount = useMemo(() => 
    projects.filter(p => p?.is_priority).length,
    [projects]
  );
  
  const [priorityCount, setPriorityCount] = useState<number>(initialPriorityCount);
  const [tableProjects, setTableProjects] = useState<Project[]>(projects);

  // Update table projects when props change
  useEffect(() => {
    setTableProjects(projects);
  }, [projects]);

  // Navigate to project pipeline view with consistent parameter naming
  const handleViewProject = useCallback((projectId: string) => {
    navigate(`/brand/orders?projectId=${projectId}`);
  }, [navigate]);

  const handleTogglePriority = useCallback(async (project: Project) => {
    if (!project?.id) return;
    
    const newPriorityValue = !project.is_priority;
    
    // Check if we're trying to add a new priority and already have 5
    if (newPriorityValue && priorityCount >= 5 && !project.is_priority) {
      toast({
        title: "Priority limit reached",
        description: "You can only have up to 5 priority projects",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_priority: newPriorityValue })
        .eq('id', project.id);
        
      if (error) throw error;
      
      // Update local state for immediate UI feedback
      if (newPriorityValue) {
        setPriorityCount(prev => prev + 1);
        toast({ 
          title: "Added to priority", 
          description: "Project has been marked as priority" 
        });
      } else {
        setPriorityCount(prev => prev - 1);
        toast({ 
          title: "Removed from priority", 
          description: "Project has been removed from priority" 
        });
      }
      
      // Force refresh the UI by updating the project in our local data
      setTableProjects(prev => 
        prev.map(p => p.id === project.id ? {...p, is_priority: newPriorityValue} : p)
      );
      
    } catch (error) {
      console.error('Error updating priority status:', error);
      toast({
        title: "Error",
        description: "Failed to update priority status",
        variant: "destructive"
      });
    }
  }, [priorityCount, toast]);

  // Handle project deletion and update the UI
  const handleProjectDeleted = useCallback((projectId: string) => {
    // Remove the project from the local state
    setTableProjects(prev => prev.filter(p => p.id !== projectId));
    
    // Update priority count if needed
    const deletedProject = projects.find(p => p.id === projectId);
    if (deletedProject?.is_priority) {
      setPriorityCount(prev => prev - 1);
    }
  }, [projects]);

  // Memoize the sorted projects to avoid recalculation on every render
  const sortedProjects = useMemo(() => {
    if (!Array.isArray(tableProjects)) return [];
    
    // Separate priority and non-priority projects
    const priorityProjects = tableProjects.filter(project => project?.is_priority);
    const regularProjects = tableProjects.filter(project => !project?.is_priority);
    
    // Combine them with priority projects first
    return [...priorityProjects, ...regularProjects];
  }, [tableProjects]);

  const priorityProjectsCount = useMemo(() => 
    sortedProjects.filter(project => project?.is_priority).length,
    [sortedProjects]
  );

  return {
    sortedProjects,
    priorityProjectsCount,
    handleTogglePriority,
    handleViewProject,
    handleProjectDeleted
  };
};
