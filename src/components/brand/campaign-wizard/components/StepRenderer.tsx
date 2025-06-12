
import React from 'react';
import { CampaignWizardData } from '@/types/campaignWizard';
import CampaignBasicsStep from '../steps/CampaignBasicsStep';
import ContentRequirementsStep from '../steps/ContentRequirementsStep';
import BudgetDeliverablesStep from '../steps/BudgetDeliverablesStep';
import CreatorSelectionStep from '../steps/CreatorSelectionStep';
import ReviewLaunchStep from '../steps/ReviewLaunchStep';

interface StepRendererProps {
  currentStep: number;
  formData: Partial<CampaignWizardData>;
  isDraftLoading: boolean;
  onComplete: (stepData: Partial<CampaignWizardData>) => void;
  onBack: () => void;
  onLaunch: () => void;
  isSubmitting: boolean;
}

export const StepRenderer: React.FC<StepRendererProps> = ({
  currentStep,
  formData,
  isDraftLoading,
  onComplete,
  onBack,
  onLaunch,
  isSubmitting
}) => {
  const stepProps = {
    data: formData,
    onComplete,
    onBack,
    isLoading: isDraftLoading
  };

  switch (currentStep) {
    case 1:
      return <CampaignBasicsStep {...stepProps} />;
    case 2:
      return <ContentRequirementsStep {...stepProps} />;
    case 3:
      return <BudgetDeliverablesStep {...stepProps} />;
    case 4:
      return <CreatorSelectionStep {...stepProps} />;
    case 5:
      return (
        <ReviewLaunchStep 
          {...stepProps} 
          onLaunch={onLaunch} 
          isSubmitting={isSubmitting} 
        />
      );
    default:
      return null;
  }
};
