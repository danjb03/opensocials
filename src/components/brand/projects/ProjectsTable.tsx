
import React from 'react';
import { Table } from '@/components/ui/table';
import { Project } from '@/types/projects';
import { ProjectsTableHeader } from './ProjectsTableHeader';
import { ProjectsTableBody } from './ProjectsTableBody';
import { ProjectsTableLoading } from './ProjectsTableLoading';
import { useProjectsTableLogic } from './useProjectsTableLogic';

interface ProjectsTableProps {
  projects: Project[];
  isLoading: boolean;
}

export const ProjectsTable = React.memo<ProjectsTableProps>(({ projects = [], isLoading }) => {
  const {
    sortedProjects,
    priorityProjectsCount,
    handleTogglePriority,
    handleViewProject
  } = useProjectsTableLogic({ projects });

  // Show loading state
  if (isLoading) {
    return <ProjectsTableLoading />;
  }

  if (!Array.isArray(sortedProjects) || sortedProjects.length === 0) {
    return null; // EmptyState component will be shown by the parent
  }

  return (
    <div className="rounded-md border overflow-hidden bg-black">
      <Table>
        <ProjectsTableHeader />
        <ProjectsTableBody 
          projects={sortedProjects}
          priorityProjectsCount={priorityProjectsCount}
          onTogglePriority={handleTogglePriority}
          onViewProject={handleViewProject}
        />
      </Table>
    </div>
  );
});

ProjectsTable.displayName = 'ProjectsTable';
