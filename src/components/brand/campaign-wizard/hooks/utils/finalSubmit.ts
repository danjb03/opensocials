
import { toast } from 'sonner';
import { CampaignWizardData } from '@/types/campaignWizard';
import { createCampaignFromDraft } from './campaignCreation';

export const handleFinalSubmit = async (
  formData: Partial<CampaignWizardData>,
  userId: string,
  currentStep: number,
  clearDraft: () => Promise<void>,
  draftId: string | undefined,
  setIsSubmitting: (value: boolean) => void,
  navigate: (path: string) => void
) => {
  if (!formData || Object.keys(formData).length === 0) {
    toast.error('No campaign data to submit');
    return;
  }
  
  if (!formData.name || !formData.name.trim()) {
    toast.error('Campaign name is required');
    return;
  }
  
  setIsSubmitting(true);
  try {
    console.log('🚀 Final submit triggered with data:', formData);
    console.log('🚀 Final submit - User ID check:', {
      'userId': userId
    });
    
    // Create the campaign with active status
    const campaign = await createCampaignFromDraft(formData, 'active', userId, currentStep);
    
    console.log('✅ Campaign launched with ID:', campaign.id, 'brand_id:', campaign.brand_id);
    
    // Clear the draft after successful campaign creation
    if (draftId) {
      try {
        await clearDraft();
      } catch (clearError) {
        console.warn('Failed to clear draft after campaign creation:', clearError);
      }
    }
    
    toast.success('Campaign launched successfully!', {
      description: 'Your campaign is now live and visible to creators.'
    });
    
    // Navigate to projects page to see the new campaign
    navigate('/brand/projects');
    
  } catch (error) {
    toast.error('Failed to launch campaign. Please try again.');
    console.error('Campaign creation error:', error);
  } finally {
    setIsSubmitting(false);
  }
};
