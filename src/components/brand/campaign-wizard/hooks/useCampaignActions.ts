
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';
import { CampaignWizardData } from '@/types/campaignWizard';
import { handleStepCompletion } from './utils/stepCompletion';
import { handleSaveAndExit } from './utils/saveAndExit';
import { handleFinalSubmit } from './utils/finalSubmit';

export const useCampaignActions = (
  formData: Partial<CampaignWizardData>,
  currentStep: number,
  saveDraft: (data: Partial<CampaignWizardData>, step: number) => Promise<void>,
  clearDraft: () => Promise<void>,
  draftId: string | undefined,
  onComplete?: (projectId: string) => void
) => {
  const navigate = useNavigate();
  const { user } = useUnifiedAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);

  const handleStepCompleteAction = useCallback(async (stepData: Partial<CampaignWizardData>) => {
    if (!user?.id) return;
    
    await handleStepCompletion(
      stepData,
      currentStep,
      () => saveDraft(stepData, currentStep),
      setLastSaveTime
    );
  }, [user?.id, currentStep, saveDraft]);

  const handleSaveAndExitAction = useCallback(async () => {
    if (!user?.id) return;
    
    await handleSaveAndExit(
      formData,
      user.id,
      currentStep,
      () => saveDraft(formData, currentStep),
      clearDraft,
      isSubmitting,
      setIsSubmitting,
      navigate
    );
  }, [user?.id, formData, currentStep, saveDraft, clearDraft, isSubmitting, navigate]);

  const handleFinalSubmitAction = useCallback(async () => {
    if (!user?.id) return;
    
    await handleFinalSubmit(
      formData,
      user.id,
      currentStep,
      clearDraft,
      draftId,
      setIsSubmitting,
      navigate,
      () => setShowFireworks(true) // Trigger fireworks for first campaign
    );
  }, [user?.id, formData, currentStep, clearDraft, draftId, navigate]);

  const handleFireworksComplete = useCallback(() => {
    setShowFireworks(false);
  }, []);

  return {
    isSubmitting,
    lastSaveTime,
    showFireworks,
    handleStepComplete: handleStepCompleteAction,
    handleSaveAndExit: handleSaveAndExitAction,
    handleFinalSubmit: handleFinalSubmitAction,
    handleFireworksComplete
  };
};
