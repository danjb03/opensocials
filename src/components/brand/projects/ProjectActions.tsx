
import { Button } from '@/components/ui/button';
import { Eye, Star, Trash2 } from 'lucide-react';
import { Project } from '@/types/projects';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteProject = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id);

      if (error) throw error;
      
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted."
      });
      
      // Force refresh the page to update the projects list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

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
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 hover:bg-red-50 text-red-600 border-red-200"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{project.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProject} 
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
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
