
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { CampaignWizardData } from '@/types/campaignWizard';
import { handleStepCompletion } from './utils/stepCompletion';
import { handleSaveAndExit } from './utils/saveAndExit';
import { handleFinalSubmit } from './utils/finalSubmit';

export const useCampaignActions = (
  formData: Partial<CampaignWizardData>,
  currentStep: number,
  saveDraft: () => Promise<void>,
  clearDraft: () => Promise<void>,
  draftId?: string,
  onComplete?: (projectId: string) => void
) => {
  const navigate = useNavigate();
  const { user, brandProfile } = useUnifiedAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);

  // STANDARDIZE on user.id consistently (this is what useProjectQuery uses)
  const userId = user?.id;

  console.log('🔍 useCampaignActions - User ID Debug:', {
    'user.id': user?.id,
    'brandProfile?.user_id': brandProfile?.user_id,
    'selectedUserId': userId,
    'formData.name': formData?.name
  });

  const handleStepComplete = async (stepData: Partial<CampaignWizardData>) => {
    if (!userId) {
      console.error('❌ No user authenticated');
      return;
    }
    
    await handleStepCompletion(stepData, currentStep, saveDraft, setLastSaveTime);
  };

  const handleSaveAndExitAction = async () => {
    if (!userId) {
      console.error('❌ No user authenticated');
      return;
    }
    
    await handleSaveAndExit(
      formData,
      userId,
      currentStep,
      saveDraft,
      clearDraft,
      isSubmitting,
      setIsSubmitting,
      navigate
    );
  };

  const handleFinalSubmitAction = async () => {
    if (!userId) {
      console.error('❌ No user authenticated');
      return;
    }
    
    await handleFinalSubmit(
      formData,
      userId,
      currentStep,
      clearDraft,
      draftId,
      setIsSubmitting,
      navigate
    );
  };

  return {
    isSubmitting,
    lastSaveTime,
    handleStepComplete,
    handleSaveAndExit: handleSaveAndExitAction,
    handleFinalSubmit: handleFinalSubmitAction
  };
};
