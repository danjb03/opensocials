
import React from 'react';
import { TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Project } from '@/types/projects';
import { ProjectRow } from './ProjectRow';

interface ProjectsTableBodyProps {
  projects: Project[];
  priorityProjectsCount: number;
  onTogglePriority: (project: Project) => void;
  onViewProject: (projectId: string) => void;
}

export const ProjectsTableBody = React.memo<ProjectsTableBodyProps>(({ 
  projects, 
  priorityProjectsCount, 
  onTogglePriority, 
  onViewProject 
}) => {
  return (
    <TableBody>
      {projects.map((project, index) => {
        if (!project?.id) return null;
        
        // Add a separator between priority and regular projects
        const isPrioritySeparator = priorityProjectsCount > 0 && 
                                  index === priorityProjectsCount && 
                                  (projects.length - priorityProjectsCount) > 0;
        
        return (
          <React.Fragment key={project.id}>
            {isPrioritySeparator && (
              <TableRow>
                <TableCell colSpan={7} className="bg-gray-900 border-gray-800">
                  <div className="text-xs font-medium text-gray-400 py-1 px-2">
                    Standard Projects
                  </div>
                </TableCell>
              </TableRow>
            )}
            
            <ProjectRow 
              project={project}
              isPrioritySeparator={isPrioritySeparator}
              onTogglePriority={onTogglePriority}
              onViewProject={onViewProject}
            />
          </React.Fragment>
        );
      })}
    </TableBody>
  );
});

ProjectsTableBody.displayName = 'ProjectsTableBody';
