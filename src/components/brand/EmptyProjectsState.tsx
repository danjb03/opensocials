
import React from 'react';
import { Plus } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

interface EmptyProjectsStateProps {
  onCreateProject: () => void;
}

export function EmptyProjectsState({ onCreateProject }: EmptyProjectsStateProps) {
  return (
    <EmptyState
      icon={Plus}
      title="No projects found"
      description="Get started by creating your first marketing campaign to connect with creators and grow your brand."
      action={{
        label: "Create Project",
        onClick: onCreateProject,
        variant: "default"
      }}
      className="animate-fade-in"
    />
  );
}
