
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Project, ProjectStatus, statusOptions } from '@/types/projects';
import { formatCurrency } from '@/utils/project';

type ProjectTableProps = {
  projects: Project[];
  onStatusChange: (projectId: string, newStatus: ProjectStatus) => void;
  onSuggestCreators: (projectId: string) => void;
};

export const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  onStatusChange,
  onSuggestCreators
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Campaign Type</TableHead>
            <TableHead>Date Range</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Platforms</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map(project => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {project.name}
                  {project.is_priority && (
                    <Badge variant="destructive" className="ml-2">
                      Priority
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{project.campaign_type}</TableCell>
              <TableCell>
                {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
              </TableCell>
              <TableCell>{formatCurrency(project.budget, project.currency)}</TableCell>
              <TableCell>{project.platforms?.join(', ') || 'None'}</TableCell>
              <TableCell>
                <Select
                  defaultValue={project.status || 'new'}
                  onValueChange={(value) => onStatusChange(project.id, value as ProjectStatus)}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => onSuggestCreators(project.id)}
                >
                  Suggest Creators
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
