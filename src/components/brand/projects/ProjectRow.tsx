
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
      className={`hover:bg-gray-50/50 ${project.is_priority ? "bg-amber-50/30" : ""}`}
    >
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
        <ProjectStatusBadge status={project.status as ProjectStatus} />
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
        <ProjectActions 
          project={project} 
          onTogglePriority={onTogglePriority} 
          onViewProject={onViewProject} 
        />
      </TableCell>
    </TableRow>
  );
};
