
import { TableRow, TableCell } from '@/components/ui/table';
import { Project, ProjectStatus } from '@/types/projects';
import { formatCurrency } from '@/utils/project';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { ProjectActions } from './ProjectActions';

interface ProjectRowProps {
  project: Project;
  isPrioritySeparator: boolean;
  onTogglePriority: (project: Project) => void;
  onViewProject: (projectId: string) => void;
}

export const ProjectRow = ({ 
  project, 
  isPrioritySeparator,
  onTogglePriority, 
  onViewProject 
}: ProjectRowProps) => {
  return (
    <TableRow 
      className={`hover:bg-muted/30 transition-colors ${project.is_priority ? "bg-amber-500/10" : ""}`}
    >
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span className="text-foreground font-semibold">{project.name}</span>
          <span className="text-xs text-muted-foreground">{project.campaign_type}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          {project.start_date && (
            <div className="text-muted-foreground">
              <span className="font-medium">Start:</span>{" "}
              {new Date(project.start_date).toLocaleDateString()}
            </div>
          )}
          {project.end_date && (
            <div className="text-muted-foreground">
              <span className="font-medium">End:</span>{" "}
              {new Date(project.end_date).toLocaleDateString()}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="font-semibold text-foreground">{formatCurrency(project.budget, project.currency)}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            Assignment Pending
          </div>
        </div>
      </TableCell>
      <TableCell>
        <ProjectStatusBadge status={project.status as ProjectStatus} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-full bg-muted rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '35%' }}></div>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">35%</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <ProjectActions 
          project={project} 
          onTogglePriority={onTogglePriority} 
          onViewProject={onViewProject} 
        />
      </TableCell>
    </TableRow>
  );
};
