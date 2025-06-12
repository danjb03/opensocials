
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BrandLayout from '@/components/layouts/BrandLayout';
import { CampaignWizardData, CampaignStep, CAMPAIGN_STEPS } from '@/types/campaignWizard';
import { useCampaignDraft } from '@/hooks/useCampaignDraft';
import { useCampaignActions } from './hooks/useCampaignActions';
import { CampaignWizardHeader } from './components/CampaignWizardHeader';
import { StepIndicators } from './components/StepIndicators';
import { StepRenderer } from './components/StepRenderer';

interface CampaignWizardProps {
  draftId?: string;
  onComplete?: (projectId: string) => void;
}

const CampaignWizard: React.FC<CampaignWizardProps> = ({ draftId, onComplete }) => {
  const { 
    formData, 
    updateFormData, 
    currentStep, 
    nextStep,
    prevStep,
    isDraftLoading,
    saveDraft,
    clearDraft,
    isSaving
  } = useCampaignDraft();

  const [steps, setSteps] = useState<CampaignStep[]>(CAMPAIGN_STEPS);

  const {
    isSubmitting,
    lastSaveTime,
    handleStepComplete,
    handleSaveAndExit,
    handleFinalSubmit
  } = useCampaignActions(
    formData,
    currentStep,
    saveDraft,
    clearDraft,
    draftId,
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
    <BrandLayout>
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
    </BrandLayout>
  );
};

export default CampaignWizard;
