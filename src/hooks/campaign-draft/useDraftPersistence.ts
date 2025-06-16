
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { CampaignWizardData } from '@/types/campaignWizard';

const AUTO_SAVE_DELAY = 2000; // Auto-save after 2 seconds of inactivity

export const useDraftPersistence = (formData: Partial<CampaignWizardData>, currentStep: number) => {
  const { brandProfile } = useUnifiedAuth();
  const queryClient = useQueryClient();
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Fetch existing draft
  const { data: existingDraft, isLoading: isDraftLoading } = useQuery({
    queryKey: ['campaign-draft', brandProfile?.user_id],
    queryFn: async () => {
      if (!brandProfile?.user_id) return null;
      
      console.log('Fetching draft for brand:', brandProfile.user_id);
      
      const { data, error } = await supabase
        .from('project_drafts')
        .select('*')
        .eq('brand_id', brandProfile.user_id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching draft:', error);
        throw error;
      }

      console.log('Fetched draft:', data);
      return data;
    },
    enabled: !!brandProfile?.user_id
  });

  // Save draft mutation
  const saveDraftMutation = useMutation({
    mutationFn: async (data: Partial<CampaignWizardData>) => {
      if (!brandProfile?.user_id) {
        console.error('No brand profile available');
        throw new Error('No brand profile');
      }

      console.log('Saving draft data:', data);
      const draftData = JSON.stringify(data) as any;

      if (existingDraft?.id) {
        console.log('Updating existing draft:', existingDraft.id);
        const { error } = await supabase
          .from('project_drafts')
          .update({
            draft_data: draftData,
            current_step: currentStep,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingDraft.id)
          .eq('brand_id', brandProfile.user_id);

        if (error) {
          console.error('Error updating draft:', error);
          throw error;
        }
        console.log('Draft updated successfully');
      } else {
        console.log('Creating new draft');
        const { error } = await supabase
          .from('project_drafts')
          .insert({
            brand_id: brandProfile.user_id,
            draft_data: draftData,
            current_step: currentStep
          });

        if (error) {
          console.error('Error creating draft:', error);
          throw error;
        }
        console.log('Draft created successfully');
      }
    },
    onSuccess: () => {
      console.log('Draft save successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['campaign-draft'] });
    },
    onError: (error) => {
      console.error('Draft save failed:', error);
    }
  });

  // Auto-save function with debouncing
  const triggerAutoSave = (data: Partial<CampaignWizardData>) => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    const timeout = setTimeout(() => {
      if (Object.keys(data).length > 0) {
        console.log('Auto-saving draft after delay');
        saveDraftMutation.mutate(data);
      }
    }, AUTO_SAVE_DELAY);

    setAutoSaveTimeout(timeout);
  };

  // Auto-save when form data changes (but only if there's meaningful data)
  useEffect(() => {
    const hasData = formData && (
      formData.name || 
      formData.campaign_type || 
      formData.description || 
      formData.total_budget ||
      formData.content_requirements?.platforms?.length
    );

    if (hasData && brandProfile?.user_id) {
      console.log('Form data changed, triggering auto-save');
      triggerAutoSave(formData);
    }

    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [formData, brandProfile?.user_id]);

  // Auto-save when step changes
  useEffect(() => {
    const hasData = formData && Object.keys(formData).length > 0;
    if (hasData && brandProfile?.user_id) {
      console.log('Step changed, triggering auto-save');
      triggerAutoSave(formData);
    }
  }, [currentStep]);

  // Manual save function
  const saveDraft = async () => {
    console.log('Manual save triggered');
    return saveDraftMutation.mutateAsync(formData);
  };

  // Clear draft when campaign is published
  const clearDraft = async () => {
    if (existingDraft?.id && brandProfile?.user_id) {
      console.log('Clearing draft');
      const { error } = await supabase
        .from('project_drafts')
        .delete()
        .eq('id', existingDraft.id)
        .eq('brand_id', brandProfile.user_id);

      if (error) {
        console.error('Error clearing draft:', error);
      } else {
        console.log('Draft cleared successfully');
        queryClient.invalidateQueries({ queryKey: ['campaign-draft'] });
      }
    }
  };

  return {
    existingDraft,
    isDraftLoading,
    saveDraft,
    clearDraft,
    isSaving: saveDraftMutation.isPending
  };
};
