
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import BrandLayout from '@/components/layouts/BrandLayout';
import { CampaignWizardData, CampaignStep, CAMPAIGN_STEPS } from '@/types/campaignWizard';
import { useCampaignDraft } from '@/hooks/useCampaignDraft';
import { useCampaignActions } from './hooks/useCampaignActions';
import { CampaignWizardHeader } from './components/CampaignWizardHeader';
import { StepIndicators } from './components/StepIndicators';
import { StepRenderer } from './components/StepRenderer';
import { FireworksAnimation } from '@/components/ui/fireworks-animation';

interface CampaignWizardProps {
  draftId?: string;
  onComplete?: (projectId: string) => void;
}

const CampaignWizard: React.FC<CampaignWizardProps> = ({ onComplete }) => {
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('draftId') || undefined;
  
  const { 
    formData, 
    updateFormData, 
    currentStep, 
    nextStep,
    prevStep,
    isDraftLoading,
    saveDraft,
    clearDraft,
    isSaving,
    draftId: existingDraftId
  } = useCampaignDraft();

  const [steps, setSteps] = useState<CampaignStep[]>(CAMPAIGN_STEPS);

  const {
    isSubmitting,
    lastSaveTime,
    showFireworks,
    handleStepComplete,
    handleSaveAndExit,
    handleFinalSubmit,
    handleFireworksComplete
  } = useCampaignActions(
    formData,
    currentStep,
    saveDraft,
    clearDraft,
    existingDraftId,
    onComplete
  );

  // Load draft data if editing existing draft
  useEffect(() => {
    if (draftId) {
      // loadDraft functionality would be handled in the hook
    }
  }, [draftId]);

  // Update step completion status
  useEffect(() => {
    const updatedSteps = steps.map((step, index) => ({
      ...step,
      complete: index < currentStep - 1,
      current: index === currentStep - 1
    }));
    setSteps(updatedSteps);
  }, [currentStep]);

  const handleStepCompleteWithNavigation = async (stepData: Partial<CampaignWizardData>) => {
    const updatedData = { ...formData, ...stepData };
    updateFormData(stepData);
    
    await handleStepComplete(stepData);
    
    if (currentStep < 5) {
      nextStep();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      prevStep();
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4">
          <CampaignWizardHeader
            currentStep={currentStep}
            totalSteps={CAMPAIGN_STEPS.length}
            isSaving={isSaving}
            lastSaveTime={lastSaveTime}
            onSaveAndExit={handleSaveAndExit}
          />

          <StepIndicators steps={steps} />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              <StepRenderer
                currentStep={currentStep}
                formData={formData}
                isDraftLoading={isDraftLoading}
                onComplete={handleStepCompleteWithNavigation}
                onBack={handlePreviousStep}
                onLaunch={handleFinalSubmit}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <FireworksAnimation
        show={showFireworks}
        onComplete={handleFireworksComplete}
        duration={2000}
      />
    </>
  );
};

export default CampaignWizard;
