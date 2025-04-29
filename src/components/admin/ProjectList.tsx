
import React from 'react';
import { ProjectCard } from './ProjectCard';
import { ProjectTable } from './ProjectTable';
import { EmptyProjectState } from './EmptyProjectState';
import { Project, ProjectStatus } from '@/types/projects';

type ProjectListProps = {
  projects: Project[];
  isMobile: boolean;
  loading: boolean;
  onStatusChange: (projectId: string, newStatus: ProjectStatus) => void;
  onSuggestCreators: (projectId: string) => void;
  onRefresh: () => void;
  selectedCampaignTypes: string[];
};

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  isMobile,
  loading,
  onStatusChange,
  onSuggestCreators,
  onRefresh,
  selectedCampaignTypes
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading projects...</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <EmptyProjectState 
        onRefresh={onRefresh} 
        hasFilters={selectedCampaignTypes.length > 0} 
      />
    );
  }

  if (isMobile) {
    return (
      <div className="grid grid-cols-1 gap-6">
        {projects.map(project => (
          <ProjectCard 
            key={project.id}
            project={project}
            onStatusChange={onStatusChange}
            onSuggestCreators={onSuggestCreators}
          />
        ))}
      </div>
    );
  }

  return (
    <ProjectTable 
      projects={projects}
      onStatusChange={onStatusChange}
      onSuggestCreators={onSuggestCreators}
    />
  );
};
