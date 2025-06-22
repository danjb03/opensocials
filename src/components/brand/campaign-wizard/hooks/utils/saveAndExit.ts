
import { toast } from 'sonner';
import { CampaignWizardData } from '@/types/campaignWizard';
import { createCampaignFromDraft } from './campaignCreation';

export const handleSaveAndExit = async (
  formData: Partial<CampaignWizardData>,
  userId: string,
  currentStep: number,
  saveDraft: () => Promise<void>,
  clearDraft: () => Promise<void>,
  isSubmitting: boolean,
  setIsSubmitting: (value: boolean) => void,
  navigate: (path: string) => void
) => {
  if (isSubmitting) {
    console.log('Save already in progress, ignoring');
    return;
  }

  setIsSubmitting(true);
  
  try {
    console.log('💾 Save and exit triggered with data:', formData);
    console.log('💾 Save and exit - User ID check:', {
      'userId': userId,
      'formData.name': formData?.name
    });
    
    if (!formData || Object.keys(formData).length === 0) {
      toast.error('No data to save');
      return;
    }

    if (!userId) {
      console.error('❌ User not authenticated in save and exit');
      toast.error('User not authenticated');
      return;
    }

    if (!formData.name || !formData.name.trim()) {
      toast.error('Campaign name is required to save');
      return;
    }

    // Create the campaign directly with draft status
    try {
      const campaign = await createCampaignFromDraft(formData, 'draft', userId, currentStep);
      
      console.log('✅ Campaign saved with ID:', campaign.id, 'brand_id:', campaign.brand_id);
      
      // Clear the draft after successful campaign creation
      try {
        await clearDraft();
      } catch (clearError) {
        console.warn('Failed to clear draft after campaign creation:', clearError);
      }
      
      toast.success('Campaign saved successfully!', {
        description: 'You can find it in your projects list.'
      });
      
      // Navigate to brand dashboard
      navigate('/brand');
    } catch (campaignError) {
      console.error('❌ Error creating campaign:', campaignError);
      
      // If campaign creation fails, try to save as draft
      try {
        await saveDraft();
        toast.success('Campaign progress saved!', {
          description: 'You can continue editing it later.'
        });
        navigate('/brand');
      } catch (draftError) {
        console.error('Failed to save draft as fallback:', draftError);
        throw new Error('Failed to save campaign or draft');
      }
    }
  } catch (error) {
    console.error('Error in save and exit:', error);
    toast.error('Failed to save campaign. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};
