
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { statusColors, type ProjectStatus } from '@/types/projects';

interface ProjectHeaderProps {
  project: any;
  nextStepBlocked: boolean;
  showBlockedAlert: boolean;
  isUploading: boolean;
  currentStep: number;
  totalSteps: number;
  onNavigateBack: () => void;
  onProgressCampaign: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  nextStepBlocked,
  showBlockedAlert,
  isUploading,
  currentStep,
  totalSteps,
  onNavigateBack,
  onProgressCampaign,
}) => {
  const renderStatus = (status: ProjectStatus) => {
    const colorClass = statusColors[status] || "bg-gray-100 text-gray-800";
    
    return (
      <Badge className={colorClass + " text-xs capitalize"}>
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
          <div className="flex items-center gap-2">
            {renderStatus(project.status as ProjectStatus)}
            <span className="text-gray-500 text-sm">Created on {new Date(project.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button 
            variant="outline" 
            onClick={onNavigateBack}
            className="shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaign
          </Button>
          {currentStep < totalSteps && (
            <Button 
              onClick={onProgressCampaign}
              disabled={isUploading || nextStepBlocked}
              className={`${nextStepBlocked ? 'bg-gray-400 hover:bg-gray-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'} shadow-sm`}
            >
              {isUploading ? 'Uploading...' : 'Next Step'}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Show blocked alert */}
      {showBlockedAlert && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You must upload a brief and contract before proceeding to the next step.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
