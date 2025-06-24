
import { toast } from 'sonner';
import { CampaignWizardData } from '@/types/campaignWizard';
import { createCampaignFromDraft } from './campaignCreation';
import { supabase } from '@/integrations/supabase/client';

export const handleFinalSubmit = async (
  formData: Partial<CampaignWizardData>,
  userId: string,
  currentStep: number,
  clearDraft: () => Promise<void>,
  draftId: string | undefined,
  setIsSubmitting: (value: boolean) => void,
  navigate: (path: string) => void,
  onFirstCampaign?: () => void
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

    // Check if this is the brand's first campaign
    let isFirstCampaign = false;
    try {
      // Get brand profile to get brand_id
      const { data: brandProfile } = await supabase
        .from('brand_profiles')
        .select('user_id')
        .eq('user_id', userId)
        .single();

      if (brandProfile) {
        // Count existing campaigns for this brand
        const { count } = await supabase
          .from('projects_new')
          .select('*', { count: 'exact', head: true })
          .eq('brand_id', userId);

        isFirstCampaign = count === 0;
        console.log('🎯 First campaign check:', { count, isFirstCampaign });
      }
    } catch (error) {
      console.warn('Could not check first campaign status:', error);
    }
    
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

    // Show fireworks animation for first campaign
    if (isFirstCampaign && onFirstCampaign) {
      onFirstCampaign();
      // Wait for fireworks animation to complete before showing toast and navigating
      setTimeout(() => {
        toast.success('Campaign launched successfully!', {
          description: 'Your campaign is now live and visible to creators.'
        });
        navigate('/brand/projects');
      }, 2200); // Slightly longer than animation duration
    } else {
      // Regular success flow for subsequent campaigns
      toast.success('Campaign launched successfully!', {
        description: 'Your campaign is now live and visible to creators.'
      });
      navigate('/brand/projects');
    }
    
  } catch (error) {
    toast.error('Failed to launch campaign. Please try again.');
    console.error('Campaign creation error:', error);
  } finally {
    setIsSubmitting(false);
  }
};
