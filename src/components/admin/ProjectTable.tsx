
import React, { useCallback, useMemo } from 'react';
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

export const ProjectTable: React.FC<ProjectTableProps> = React.memo(({
  projects,
  onStatusChange,
  onSuggestCreators
}) => {
  const handleStatusChange = useCallback((projectId: string, newStatus: ProjectStatus) => {
    onStatusChange(projectId, newStatus);
  }, [onStatusChange]);

  const handleSuggestCreators = useCallback((projectId: string) => {
    onSuggestCreators(projectId);
  }, [onSuggestCreators]);

  const memoizedStatusOptions = useMemo(() => statusOptions, []);

  // Memoized project row component to prevent unnecessary re-renders
  const ProjectTableRow = React.memo<{ project: Project }>(({ project }) => {
    const dateRange = useMemo(() => 
      `${new Date(project.start_date).toLocaleDateString()} - ${new Date(project.end_date).toLocaleDateString()}`,
      [project.start_date, project.end_date]
    );

    const formattedBudget = useMemo(() => 
      formatCurrency(project.budget, project.currency),
      [project.budget, project.currency]
    );

    const platformsText = useMemo(() => 
      project.platforms?.join(', ') || 'None',
      [project.platforms]
    );

    return (
      <TableRow>
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
        <TableCell>{dateRange}</TableCell>
        <TableCell>{formattedBudget}</TableCell>
        <TableCell>{platformsText}</TableCell>
        <TableCell>
          <Select
            defaultValue={project.status || 'new'}
            onValueChange={(value) => handleStatusChange(project.id, value as ProjectStatus)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {memoizedStatusOptions.map(option => (
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
            onClick={() => handleSuggestCreators(project.id)}
          >
            Suggest Creators
          </Button>
        </TableCell>
      </TableRow>
    );
  });

  ProjectTableRow.displayName = 'ProjectTableRow';

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
            <ProjectTableRow key={project.id} project={project} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

ProjectTable.displayName = 'ProjectTable';
