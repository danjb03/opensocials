
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
import { Eye, Star, Calendar, DollarSign, Users, BarChart2 } from 'lucide-react';
import { formatCurrency } from '@/utils/project';
import { statusColors, type ProjectStatus } from '@/types/projects';
import type { Project } from '@/types/projects';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProjectsTableProps {
  projects: Project[];
  isLoading: boolean;
}

export const ProjectsTable = ({ projects, isLoading }: ProjectsTableProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Helper function to render status badge
  const renderStatus = (status: ProjectStatus) => {
    const colorClass = statusColors[status] || "bg-gray-100 text-gray-800";
    
    return (
      <Badge className={colorClass + " capitalize"}>
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/brand/projects/${projectId}`);
  };

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

  if (projects.length === 0) {
    return null; // EmptyState component will be shown by the parent
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Campaign</TableHead>
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
          {projects.map((project) => (
            <TableRow key={project.id} className="hover:bg-gray-50/50">
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{project.name}</span>
                  <span className="text-xs text-gray-500">{project.campaign_type}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {project.start_date && (
                    <div>
                      <span className="text-gray-700 font-medium">Start:</span>{" "}
                      {new Date(project.start_date).toLocaleDateString()}
                    </div>
                  )}
                  {project.end_date && (
                    <div>
                      <span className="text-gray-700 font-medium">End:</span>{" "}
                      {new Date(project.end_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{formatCurrency(project.budget, project.currency)}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Assignment Pending
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {renderStatus(project.status as ProjectStatus)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">35%</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                    onClick={() => project.is_priority ? null : toast({ title: "Added to priority", description: "Project has been marked as priority" })}
                  >
                    <Star className={`h-4 w-4 ${project.is_priority ? "fill-yellow-400 text-yellow-400" : ""}`} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewProject(project.id)}
                    className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
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
