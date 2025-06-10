
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProjectFilters } from '@/components/brand/ProjectFilters';

interface ProjectsHeaderProps {
  filters: {
    campaignTypes: string[];
    platforms: string[];
    campaignName: string;
    startMonth: string | null;
  };
  onFiltersChange: (filters: any) => void;
  onCreateProject: () => void;
}

export const ProjectsHeader = ({ 
  filters, 
  onFiltersChange, 
  onCreateProject 
}: ProjectsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Projects</h1>
        <p className="text-foreground">Manage your campaigns and projects</p>
      </div>
      
      <div className="flex items-center mt-4 md:mt-0 space-x-2">
        <ProjectFilters 
          filters={filters} 
          onFiltersChange={onFiltersChange} 
        />
        
        <Button onClick={onCreateProject}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>
    </div>
  );
};
