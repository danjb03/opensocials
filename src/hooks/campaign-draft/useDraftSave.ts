
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';
import { CampaignWizardData } from '@/types/campaignWizard';

export const useDraftSave = (
  formData: Partial<CampaignWizardData>,
  saveDraft: () => Promise<void>,
  clearDraft: () => Promise<void>
) => {
  const navigate = useNavigate();
  const { user, brandProfile } = useUnifiedAuth();
  const [isSaving, setIsSaving] = useState(false);

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
      brief_data: draftData.brief_data || {},
      platforms: draftData.brief_data?.platform_destination || [],
      deliverables: draftData.deliverables || {},
      status: 'draft',
      review_status: 'pending_review',
      current_step: 1 // Save as draft, reset to step 1
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

  const handleSaveAndExit = async () => {
    if (isSaving) {
      console.log('Save already in progress, ignoring');
      return;
    }

    setIsSaving(true);
    
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

      // Create the campaign directly (skip draft table for save and exit)
      try {
        const campaign = await createCampaignFromDraft(formData);
        
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
      setIsSaving(false);
    }
  };

  return {
    handleSaveAndExit,
    isSaving: isSaving
  };
};
