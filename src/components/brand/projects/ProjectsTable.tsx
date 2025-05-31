
import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, DollarSign, Users, BarChart2 } from 'lucide-react';
import { Project } from '@/types/projects';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProjectRow } from './ProjectRow';

interface ProjectsTableProps {
  projects: Project[];
  isLoading: boolean;
}

export const ProjectsTable = React.memo<ProjectsTableProps>(({ projects, isLoading }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const initialPriorityCount = useMemo(() => 
    projects.filter(p => p.is_priority).length,
    [projects]
  );
  
  const [priorityCount, setPriorityCount] = useState<number>(initialPriorityCount);
  const [tableProjects, setTableProjects] = useState<Project[]>(projects);

  // Navigate to project pipeline view with consistent parameter naming
  const handleViewProject = useCallback((projectId: string) => {
    navigate(`/brand/orders?projectId=${projectId}`);
  }, [navigate]);

  const handleTogglePriority = useCallback(async (project: Project) => {
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
    // Separate priority and non-priority projects
    const priorityProjects = tableProjects.filter(project => project.is_priority);
    const regularProjects = tableProjects.filter(project => !project.is_priority);
    
    // Combine them with priority projects first
    return [...priorityProjects, ...regularProjects];
  }, [tableProjects]);

  const priorityProjectsCount = useMemo(() => 
    sortedProjects.filter(project => project.is_priority).length,
    [sortedProjects]
  );

  // Show loading or empty state
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-1/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded mb-2.5"></div>
          <div className="h-4 w-2/3 bg-gray-200 rounded mb-2.5"></div>
          <div className="h-4 w-3/5 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (tableProjects.length === 0) {
    return null; // EmptyState component will be shown by the parent
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Project</TableHead>
            <TableHead className="font-semibold">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Timeline</span>
              </div>
            </TableHead>
            <TableHead className="font-semibold">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>Budget</span>
              </div>
            </TableHead>
            <TableHead className="font-semibold">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Creators</span>
              </div>
            </TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">
              <div className="flex items-center gap-1">
                <BarChart2 className="h-4 w-4" />
                <span>Performance</span>
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProjects.map((project, index) => {
            // Add a separator between priority and regular projects
            const isPrioritySeparator = priorityProjectsCount > 0 && 
                                      index === priorityProjectsCount && 
                                      (sortedProjects.length - priorityProjectsCount) > 0;
            
            return (
              <>
                {isPrioritySeparator && (
                  <TableRow>
                    <TableCell colSpan={7} className="bg-gray-50">
                      <div className="text-xs font-medium text-gray-500 py-1 px-2">
                        Standard Projects
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                
                <ProjectRow 
                  key={project.id}
                  project={project}
                  isPrioritySeparator={isPrioritySeparator}
                  onTogglePriority={handleTogglePriority}
                  onViewProject={handleViewProject}
                />
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
});

ProjectsTable.displayName = 'ProjectsTable';
