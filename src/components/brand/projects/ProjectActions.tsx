
import { Button } from '@/components/ui/button';
import { Eye, Star } from 'lucide-react';
import { Project } from '@/types/projects';

interface ProjectActionsProps {
  project: Project;
  onTogglePriority: (project: Project) => void;
  onViewProject: (projectId: string) => void;
}

export const ProjectActions = ({ 
  project, 
  onTogglePriority, 
  onViewProject 
}: ProjectActionsProps) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className={`flex items-center gap-1 hover:bg-gray-100 transition-colors ${
          project.is_priority ? "border-yellow-400 text-yellow-600" : ""
        }`}
        onClick={() => onTogglePriority(project)}
      >
        <Star className={`h-4 w-4 ${project.is_priority ? "fill-yellow-400 text-yellow-400" : ""}`} />
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onViewProject(project.id)}
        className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
      >
        <Eye className="h-4 w-4" />
        View
      </Button>
    </div>
  );
};
