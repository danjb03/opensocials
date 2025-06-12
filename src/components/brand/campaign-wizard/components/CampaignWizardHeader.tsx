
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Save, Check } from 'lucide-react';

interface CampaignWizardHeaderProps {
  currentStep: number;
  totalSteps: number;
  isSaving: boolean;
  lastSaveTime: Date | null;
  onSaveAndExit: () => void;
}

export const CampaignWizardHeader: React.FC<CampaignWizardHeaderProps> = ({
  currentStep,
  totalSteps,
  isSaving,
  lastSaveTime,
  onSaveAndExit
}) => {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const renderSaveStatus = () => {
    if (isSaving) {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          Saving...
        </div>
      );
    }
    
    if (lastSaveTime) {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-green-500" />
          Saved {lastSaveTime.toLocaleTimeString()}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-light text-foreground mb-2">
            Create New Campaign
          </h1>
          <p className="text-muted-foreground">
            Follow the steps below to create an engaging campaign
          </p>
        </div>
        <div className="flex items-center gap-4">
          {renderSaveStatus()}
          <Button
            variant="outline"
            onClick={onSaveAndExit}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save & Exit'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
    </div>
  );
};
