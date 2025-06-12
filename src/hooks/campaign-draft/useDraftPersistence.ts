
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { CampaignWizardData } from '@/types/campaignWizard';

const AUTO_SAVE_DELAY = 1000; // Auto-save after 1 second of inactivity

export const useDraftPersistence = (formData: Partial<CampaignWizardData>, currentStep: number) => {
  const { brandProfile } = useUnifiedAuth();
  const queryClient = useQueryClient();
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Fetch existing draft
  const { data: existingDraft, isLoading: isDraftLoading } = useQuery({
    queryKey: ['campaign-draft', brandProfile?.user_id],
    queryFn: async () => {
      if (!brandProfile?.user_id) return null;
      
      const { data, error } = await supabase
        .from('project_drafts')
        .select('*')
        .eq('brand_id', brandProfile.user_id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    },
    enabled: !!brandProfile?.user_id
  });

  // Save draft mutation
  const saveDraftMutation = useMutation({
    mutationFn: async (data: Partial<CampaignWizardData>) => {
      if (!brandProfile?.user_id) throw new Error('No brand profile');

      const draftData = JSON.stringify(data) as any;

      if (existingDraft?.id) {
        const { error } = await supabase
          .from('project_drafts')
          .update({
            draft_data: draftData,
            current_step: currentStep,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingDraft.id)
          .eq('brand_id', brandProfile.user_id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('project_drafts')
          .insert({
            brand_id: brandProfile.user_id,
            draft_data: draftData,
            current_step: currentStep
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-draft'] });
    }
  });

  // Auto-save function with debouncing
  const triggerAutoSave = (data: Partial<CampaignWizardData>) => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    const timeout = setTimeout(() => {
      if (Object.keys(data).length > 0) {
        saveDraftMutation.mutate(data);
      }
    }, AUTO_SAVE_DELAY);

    setAutoSaveTimeout(timeout);
  };

  // Auto-save when form data changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      triggerAutoSave(formData);
    }

    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [formData]);

  // Auto-save when step changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      triggerAutoSave(formData);
    }
  }, [currentStep]);

  // Manual save function
  const saveDraft = async () => {
    return saveDraftMutation.mutateAsync(formData);
  };

  // Clear draft when campaign is published
  const clearDraft = async () => {
    if (existingDraft?.id && brandProfile?.user_id) {
      const { error } = await supabase
        .from('project_drafts')
        .delete()
        .eq('id', existingDraft.id)
        .eq('brand_id', brandProfile.user_id);

      if (error) {
        console.error('Error clearing draft:', error);
      } else {
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
