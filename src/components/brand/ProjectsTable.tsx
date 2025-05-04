
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { formatCurrency } from '@/utils/project';
import { statusColors, type ProjectStatus } from '@/types/projects';
import type { Project } from '@/types/projects';
import { useToast } from '@/hooks/use-toast';

interface ProjectsTableProps {
  projects: Project[];
  isLoading: boolean;
}

export const ProjectsTable = ({ projects, isLoading }: ProjectsTableProps) => {
  const { toast } = useToast();

  // Helper function to render status badge
  const renderStatus = (status: ProjectStatus) => {
    const colorClass = statusColors[status] || "bg-gray-100 text-gray-800";
    
    return (
      <Badge className={colorClass}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const handleViewProject = (projectId: string) => {
    // In the future, this would navigate to a detailed project view
    toast({
      title: "Coming Soon",
      description: "Project details view is under development",
    });
  };

  // Show loading or empty state
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading projects...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return null; // EmptyState component will be shown by the parent
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campaign</TableHead>
            <TableHead>Creator(s)</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Paid</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell>
                <span className="text-gray-500">Not assigned</span>
              </TableCell>
              <TableCell>{formatCurrency(project.budget, project.currency)}</TableCell>
              <TableCell>
                <span className="text-gray-500">—</span>
              </TableCell>
              <TableCell>
                {renderStatus(project.status as ProjectStatus)}
              </TableCell>
              <TableCell>
                <span className="text-gray-500">—</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewProject(project.id)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
