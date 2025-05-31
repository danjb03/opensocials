import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Check, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import { CampaignWizardData, CampaignStep, CAMPAIGN_STEPS } from '@/types/campaignWizard';
import { useCampaignDraft } from '@/hooks/useCampaignDraft';

// Step components
import CampaignBasicsStep from './steps/CampaignBasicsStep';
import ContentRequirementsStep from './steps/ContentRequirementsStep';
import BudgetDeliverablesStep from './steps/BudgetDeliverablesStep';
import CreatorSelectionStep from './steps/CreatorSelectionStep';
import ReviewLaunchStep from './steps/ReviewLaunchStep';

interface CampaignWizardProps {
  draftId?: string;
  onComplete?: (projectId: string) => void;
}

const CampaignWizard: React.FC<CampaignWizardProps> = ({ draftId, onComplete }) => {
  const navigate = useNavigate();
  const { 
    draftData, 
    setDraftData, 
    saveDraft, 
    currentStep, 
    setCurrentStep,
    isLoading,
    loadDraft,
    createProject,
    deleteDraft
  } = useCampaignDraft(draftId);

  const [steps, setSteps] = useState<CampaignStep[]>(CAMPAIGN_STEPS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load draft data if editing existing draft
  useEffect(() => {
    if (draftId) {
      loadDraft();
    }
  }, [draftId, loadDraft]);

  // Update step completion status
  useEffect(() => {
    const updatedSteps = steps.map((step, index) => ({
      ...step,
      complete: index < currentStep - 1,
      current: index === currentStep - 1
    }));
    setSteps(updatedSteps);
  }, [currentStep]);

  const handleStepComplete = async (stepData: Partial<CampaignWizardData>) => {
    const updatedData = { ...draftData, ...stepData };
    setDraftData(updatedData);
    
    // Auto-save progress
    await saveDraft(updatedData, currentStep);
    
    // Show completion animation
    toast.success(`Step ${currentStep} Complete! 🎉`, {
      description: `${CAMPAIGN_STEPS[currentStep - 1].title} saved successfully`
    });

    // Move to next step
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAndExit = async () => {
    await saveDraft(draftData, currentStep);
    toast.success('Campaign draft saved! You can continue later.');
    navigate('/brand/dashboard');
  };

  const handleFinalSubmit = async () => {
    if (!draftData) return;
    
    setIsSubmitting(true);
    try {
      const projectId = await createProject(draftData as CampaignWizardData);
      
      // Clean up draft
      if (draftId) {
        await deleteDraft();
      }
      
      toast.success('🚀 Campaign launched successfully!', {
        description: 'Creator invitations are being sent out now.'
      });
      
      if (onComplete) {
        onComplete(projectId);
      } else {
        navigate(`/brand/project/${projectId}`);
      }
    } catch (error) {
      toast.error('Failed to launch campaign. Please try again.');
      console.error('Campaign creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    const stepProps = {
      data: draftData,
      onComplete: handleStepComplete,
      onBack: handlePreviousStep,
      isLoading
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
        return <ReviewLaunchStep {...stepProps} onLaunch={handleFinalSubmit} isSubmitting={isSubmitting} />;
      default:
        return null;
    }
  };

  const progressPercentage = ((currentStep - 1) / (CAMPAIGN_STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Create New Campaign
              </h1>
              <p className="text-gray-600 mt-1">
                Follow the steps below to create an engaging campaign
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleSaveAndExit}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save & Exit
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {CAMPAIGN_STEPS.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className="flex flex-col items-center space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-lg
                    transition-all duration-300 ${
                      step.complete
                        ? 'bg-green-500 text-white'
                        : step.current
                        ? 'bg-blue-500 text-white ring-4 ring-blue-200'
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {step.complete ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Check className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="text-center">
                  <div className={`text-sm font-medium ${
                    step.current ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 max-w-20">
                    {step.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePreviousStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1">
              Auto-save enabled
            </Badge>
            
            {currentStep < 5 && (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center gap-2"
                disabled={!draftData || Object.keys(draftData).length === 0}
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignWizard;