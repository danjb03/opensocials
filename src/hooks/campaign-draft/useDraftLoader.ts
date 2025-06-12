
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { CampaignWizardData } from '@/types/campaignWizard';

export const useDraftLoader = (
  existingDraft: any,
  setFormData: (data: Partial<CampaignWizardData>) => void,
  setCurrentStep: (step: number) => void
) => {
  const { brandProfile } = useUnifiedAuth();

  // Load existing draft data on mount
  useEffect(() => {
    if (existingDraft?.draft_data) {
      try {
        const parsedData = typeof existingDraft.draft_data === 'string' 
          ? JSON.parse(existingDraft.draft_data)
          : existingDraft.draft_data;
        
        setFormData(parsedData);
        setCurrentStep(existingDraft.current_step || 1);
      } catch (error) {
        console.error('Error parsing draft data:', error);
      }
    }
  }, [existingDraft, setFormData, setCurrentStep]);

  // Load existing draft from URL parameter if provided
  const loadDraft = async (draftId: string) => {
    if (!brandProfile?.user_id) return;
    
    const { data, error } = await supabase
      .from('project_drafts')
      .select('*')
      .eq('id', draftId)
      .eq('brand_id', brandProfile.user_id)
      .single();

    if (error) {
      console.error('Error loading draft:', error);
      return;
    }

    try {
      const parsedData = typeof data.draft_data === 'string' 
        ? JSON.parse(data.draft_data)
        : data.draft_data;
      
      setFormData(parsedData);
      setCurrentStep(data.current_step || 1);
    } catch (error) {
      console.error('Error parsing draft data:', error);
    }
  };

  return {
    loadDraft
  };
};
