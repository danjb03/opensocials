
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Project, ProjectStatus, statusOptions } from '@/types/projects';
import { formatCurrency } from '@/utils/project';

type ProjectCardProps = {
  project: Project;
  onStatusChange: (projectId: string, newStatus: ProjectStatus) => void;
  onSuggestCreators: (projectId: string) => void;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onStatusChange,
  onSuggestCreators
}) => {
  return (
    <Card key={project.id} className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{project.name}</CardTitle>
          {project.is_priority && (
            <Badge variant="destructive" className="ml-2">
              Priority
            </Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">{project.campaign_type}</div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid gap-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Budget</span>
            <span>{formatCurrency(project.budget, project.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Dates</span>
            <span>{new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Platforms</span>
            <span>{project.platforms?.join(', ') || 'None'}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm font-medium">Status</span>
            <Select
              defaultValue={project.status || 'new'}
              onValueChange={(value) => onStatusChange(project.id, value as ProjectStatus)}
            >
              <SelectTrigger className="w-[180px]">
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
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="secondary" 
          className="w-full"
          onClick={() => onSuggestCreators(project.id)}
        >
          Suggest Creators
        </Button>
      </CardFooter>
    </Card>
  );
};
