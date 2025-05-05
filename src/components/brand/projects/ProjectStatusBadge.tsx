
import { Badge } from '@/components/ui/badge';
import { statusColors, type ProjectStatus } from '@/types/projects';

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

export const ProjectStatusBadge = ({ status }: ProjectStatusBadgeProps) => {
  const colorClass = statusColors[status] || "bg-gray-100 text-gray-800";
  
  return (
    <Badge className={`${colorClass} capitalize`}>
      {status.replace(/_/g, ' ')}
    </Badge>
  );
};
