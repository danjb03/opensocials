
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

  const createCampaignFromDraft = async (draftData: Partial<CampaignWizardData>) => {
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
      content_requirements: draftData.content_requirements || {},
      messaging_guidelines: draftData.messaging_guidelines || '',
      platforms: draftData.content_requirements?.platforms || [],
      deliverables: draftData.deliverables || {},
      status: 'draft',
      review_status: 'pending_review',
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

      // First save the draft with timeout
      try {
        await Promise.race([
          saveDraft(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Save timeout')), 10000)
          )
        ]);
        setLastSaveTime(new Date());
      } catch (saveError) {
        console.error('Error saving draft:', saveError);
        toast.error('Failed to save draft');
        return;
      }
      
      // If we have sufficient data for a campaign, create it
      if (formData.name && formData.name.trim()) {
        try {
          const campaign = await createCampaignFromDraft(formData);
          toast.success('Campaign created and saved successfully!', {
            description: 'You can find it in your projects list.'
          });
          
          // Clear the draft after successful campaign creation
          if (draftId) {
            try {
              await clearDraft();
            } catch (clearError) {
              console.warn('Failed to clear draft after campaign creation:', clearError);
            }
          }
        } catch (campaignError) {
          console.error('Error creating campaign, but draft saved:', campaignError);
          toast.success('Campaign draft saved!', {
            description: 'You can continue editing it later. Note: Campaign creation failed but your progress is saved.'
          });
        }
      } else {
        toast.success('Campaign draft saved!', {
          description: 'You can continue editing it later.'
        });
      }
      
      // Use window.location.href to ensure a clean navigation
      window.location.href = '/brand';
    } catch (error) {
      console.error('Error saving campaign:', error);
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
      const campaignData = { ...formData, status: 'active' };
      const campaign = await createCampaignFromDraft(campaignData);
      
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
