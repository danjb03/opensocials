
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
  const { brandProfile } = useUnifiedAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);

  const createCampaignFromDraft = async (draftData: Partial<CampaignWizardData>) => {
    if (!brandProfile?.user_id) {
      throw new Error('No brand profile found');
    }

    const { data: campaign, error } = await supabase
      .from('projects_new')
      .insert({
        brand_id: brandProfile.user_id,
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
        status: 'pending_approval', // Changed from 'draft' to indicate awaiting admin review
        review_status: 'pending_review', // Set to pending review by default
        current_step: currentStep
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }

    return campaign;
  };

  const handleStepComplete = async (stepData: Partial<CampaignWizardData>) => {
    setLastSaveTime(new Date());
    
    toast.success(`Step ${currentStep} Complete`, {
      description: `${CAMPAIGN_STEPS[currentStep - 1].title} saved automatically`
    });
  };

  const handleSaveAndExit = async () => {
    try {
      await saveDraft();
      
      if (formData.name) {
        await createCampaignFromDraft(formData);
        toast.success('Campaign saved successfully!', {
          description: 'You can continue editing it later from your dashboard.'
        });
      } else {
        toast.success('Campaign draft saved!', {
          description: 'You can continue editing it later.'
        });
      }
      
      navigate('/brand/dashboard');
    } catch (error) {
      console.error('Error saving campaign:', error);
      toast.error('Failed to save campaign. Please try again.');
    }
  };

  const handleFinalSubmit = async () => {
    if (!formData) return;
    
    setIsSubmitting(true);
    try {
      // Create the campaign with pending review status
      const campaign = await createCampaignFromDraft(formData);
      
      if (draftId) {
        await clearDraft();
      }
      
      toast.success('Campaign submitted for review!', {
        description: 'Your campaign is now being reviewed by our team. You will be notified once approved.'
      });
      
      // Navigate to campaign status page instead of projects
      navigate('/brand/campaign-status');
      
    } catch (error) {
      toast.error('Failed to submit campaign. Please try again.');
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
