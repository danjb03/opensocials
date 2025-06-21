
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { CampaignWizardData, CAMPAIGN_STEPS } from '@/types/campaignWizard';

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

  // Use user.id if brandProfile.user_id is not available
  const userId = brandProfile?.user_id || user?.id;

  const createCampaignFromDraft = async (draftData: Partial<CampaignWizardData>, status: string = 'active') => {
    if (!userId) {
      throw new Error('No user authenticated');
    }

    console.log('Creating campaign from draft data:', draftData);

    // Prepare the campaign data with proper field mapping
    const campaignData = {
      brand_id: userId,
      name: draftData.name || 'Untitled Campaign',
      description: draftData.description || '',
      campaign_type: draftData.campaign_type || 'Single',
      start_date: draftData.timeline?.start_date ? draftData.timeline.start_date.toISOString().split('T')[0] : null,
      end_date: draftData.timeline?.end_date ? draftData.timeline.end_date.toISOString().split('T')[0] : null,
      budget: draftData.total_budget || 0,
      brief_data: draftData.brief_data || {},
      platforms: draftData.brief_data?.platform_destination || [],
      deliverables: draftData.deliverables || {},
      status: status,
      review_status: status === 'active' ? 'pending_review' : 'draft',
      current_step: currentStep
    };

    console.log('Inserting campaign data:', campaignData);

    const { data: campaign, error } = await supabase
      .from('projects_new')
      .insert(campaignData)
      .select()
      .single();

    if (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }

    console.log('Campaign created successfully:', campaign);
    return campaign;
  };

  const handleStepComplete = async (stepData: Partial<CampaignWizardData>) => {
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

  const handleSaveAndExit = async () => {
    if (isSubmitting) {
      console.log('Save already in progress, ignoring');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Save and exit triggered with data:', formData);
      
      if (!formData || Object.keys(formData).length === 0) {
        toast.error('No data to save');
        return;
      }

      if (!userId) {
        toast.error('User not authenticated');
        return;
      }

      if (!formData.name || !formData.name.trim()) {
        toast.error('Campaign name is required to save');
        return;
      }

      // Create the campaign directly with draft status
      try {
        const campaign = await createCampaignFromDraft(formData, 'draft');
        
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
        console.error('Error creating campaign:', campaignError);
        
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

  const handleFinalSubmit = async () => {
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
      console.log('Final submit triggered with data:', formData);
      
      // Create the campaign with active status
      const campaign = await createCampaignFromDraft(formData, 'active');
      
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

  return {
    isSubmitting,
    lastSaveTime,
    handleStepComplete,
    handleSaveAndExit,
    handleFinalSubmit
  };
};
