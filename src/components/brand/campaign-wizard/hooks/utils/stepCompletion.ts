
import { toast } from 'sonner';
import { CampaignWizardData, CAMPAIGN_STEPS } from '@/types/campaignWizard';

export const handleStepCompletion = async (
  stepData: Partial<CampaignWizardData>,
  currentStep: number,
  saveDraft: () => Promise<void>,
  setLastSaveTime: (time: Date) => void
) => {
  try {
    console.log('Completing step with data:', stepData);
    
    // Save the draft with a timeout to prevent hanging
    await Promise.race([
      saveDraft(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Save timeout')), 10000)
      )
    ]);
    
    setLastSaveTime(new Date());
    
    toast.success(`Step ${currentStep} Complete`, {
      description: `${CAMPAIGN_STEPS[currentStep - 1].title} saved successfully`
    });
  } catch (error) {
    console.error('Error saving step:', error);
    // Don't block progression if save fails
    toast.error('Failed to save step progress, but continuing');
  }
};
