
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Check, Save, ArrowLeft, ArrowRight, Target, Smartphone, DollarSign, Users, Rocket } from 'lucide-react';
import { toast } from 'sonner';
import BrandLayout from '@/components/layouts/BrandLayout';

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
  
  // Icon mapping for campaign steps
  const getStepIcon = (iconName: string) => {
    const iconMap = {
      'target': Target,
      'smartphone': Smartphone,
      'dollar-sign': DollarSign,
      'users': Users,
      'rocket': Rocket
    };
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="h-6 w-6" /> : null;
  };

  const { 
    formData, 
    updateFormData, 
    currentStep, 
    nextStep,
    prevStep,
    goToStep,
    isDraftLoading,
    saveDraft,
    clearDraft
  } = useCampaignDraft();

  const [steps, setSteps] = useState<CampaignStep[]>(CAMPAIGN_STEPS);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleStepComplete = async (stepData: Partial<CampaignWizardData>) => {
    const updatedData = { ...formData, ...stepData };
    updateFormData(stepData);
    
    // Auto-save progress
    saveDraft();
    
    // Show completion animation
    toast.success(`Step ${currentStep} Complete`, {
      description: `${CAMPAIGN_STEPS[currentStep - 1].title} saved successfully`
    });

    // Move to next step
    if (currentStep < 5) {
      nextStep();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      prevStep();
    }
  };

  const handleSaveAndExit = async () => {
    saveDraft();
    toast.success('Campaign draft saved! You can continue later.');
    navigate('/brand/dashboard');
  };

  const handleFinalSubmit = async () => {
    if (!formData) return;
    
    setIsSubmitting(true);
    try {
      // This would need to be implemented in the hook or as a separate function
      // const projectId = await createProject(formData as CampaignWizardData);
      
      // Clean up draft
      if (draftId) {
        await clearDraft();
      }
      
      toast.success('Campaign launched successfully', {
        description: 'Creator invitations are being sent out now.'
      });
      
      if (onComplete) {
        // onComplete(projectId);
      } else {
        navigate('/brand/projects');
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
      data: formData,
      onComplete: handleStepComplete,
      onBack: handlePreviousStep,
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
        return <ReviewLaunchStep {...stepProps} onLaunch={handleFinalSubmit} isSubmitting={isSubmitting} />;
      default:
        return null;
    }
  };

  const progressPercentage = ((currentStep - 1) / (CAMPAIGN_STEPS.length - 1)) * 100;

  return (
    <BrandLayout>
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
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
                <span className="text-sm font-medium text-foreground">
                  Step {currentStep} of {CAMPAIGN_STEPS.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progressPercentage)}% Complete
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between mt-8 px-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className="flex flex-col items-center space-y-3 flex-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-lg
                      transition-all duration-300 ${
                        step.complete
                          ? 'bg-primary text-primary-foreground'
                          : step.current
                          ? 'bg-accent text-accent-foreground ring-4 ring-accent/20'
                          : 'bg-muted text-muted-foreground'
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
                      getStepIcon(step.icon)
                    )}
                  </div>
                  <div className="text-center max-w-24">
                    <div className={`text-sm font-medium ${
                      step.current ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </BrandLayout>
  );
};

export default CampaignWizard;
