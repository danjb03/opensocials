
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyProjectsStateProps {
  onCreateProject: () => void;
}

export const EmptyProjectsState = ({ onCreateProject }: EmptyProjectsStateProps) => {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500">No projects found. Create your first project!</p>
      <Button className="mt-4" onClick={onCreateProject}>
        <Plus className="h-4 w-4 mr-2" />
        New Project
      </Button>
    </div>
  );
};
