
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, Target, ListChecks, Users, ChevronDown, ChevronRight, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Json } from '@/integrations/supabase/types';

interface ProjectDetailsProps {
  project: {
    brand_id: string;
    budget: number;
    campaign_type: string;
    content_requirements: Json;
    created_at: string;
    currency: string;
    current_step: number;
    deliverables: Json;
    description: string;
    draft_approval: boolean;
    end_date: string;
    id: string;
    name: string;
    notes: string;
    start_date: string;
    status: string;
    target_age: string;
    target_gender: string;
    target_location: string;
    updated_at: string;
  };
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, isExpanded, onToggleExpand }) => {
  const endDate = project.end_date ? new Date(project.end_date) : null;
  const today = new Date();
  const daysLeft = endDate
    ? Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const getTimeUrgencyColor = () => {
    if (daysLeft === null) return 'text-muted-foreground';
    if (daysLeft <= 1) return 'text-red-500';
    if (daysLeft <= 3) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const formatTimeLeft = () => {
    if (daysLeft === null) return 'No deadline';
    if (daysLeft === 0) return 'Due today';
    if (daysLeft === 1) return 'Due tomorrow';
    if (daysLeft < 0) return 'Expired';
    return `${daysLeft} days left`;
  };

  const startDate = new Date(project.start_date);
  const formattedStartDate = formatDistanceToNow(startDate, { addSuffix: true });

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader
        className="py-4 cursor-pointer flex flex-row items-center justify-between"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-1">
            <CardTitle className="text-lg">{project.name || 'Campaign Project'}</CardTitle>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right mr-4">
            <p className="font-bold text-lg flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {project.budget.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Total budget</p>
            <p className={`text-sm flex items-center gap-1 ${getTimeUrgencyColor()}`}>
              <CalendarDays className="h-3.5 w-3.5" />
              {formatTimeLeft()}
            </p>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </CardHeader>

      {isExpanded && (
        <>
          <CardContent className="pt-0 pb-2">
            <div className="space-y-4 border-t border-gray-100 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Start Date</span>
                  <p className="text-gray-900">{formattedStartDate}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Campaign Type</span>
                  <p className="text-gray-900">{project.campaign_type}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Target Age</span>
                  <p className="text-gray-900">{project.target_age}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Target Gender</span>
                  <p className="text-gray-900">{project.target_gender}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Target Location</span>
                  <p className="text-gray-900">{project.target_location}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Budget</span>
                  <p className="text-gray-900">{project.budget} {project.currency}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Draft Approval</span>
                  <p className="text-gray-900">{project.draft_approval ? 'Required' : 'Not Required'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Content Guidelines</span>
                  <p className="text-gray-900">Available in brief</p>
                </div>
              </div>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default ProjectDetails;
