
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { CampaignWizardData } from '@/types/campaignWizard';

const AUTO_SAVE_DELAY = 2000; // Auto-save after 2 seconds of inactivity

export const useDraftPersistence = (formData: Partial<CampaignWizardData>, currentStep: number) => {
  const { user, brandProfile } = useUnifiedAuth();
  const queryClient = useQueryClient();
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');
  const isLoadingDraftRef = useRef(false);

  // Use user.id if brandProfile.user_id is not available
  const userId = brandProfile?.user_id || user?.id;

  // Fetch existing draft
  const { data: existingDraft, isLoading: isDraftLoading } = useQuery({
    queryKey: ['campaign-draft', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      console.log('Fetching draft for user:', userId);
      
      const { data, error } = await supabase
        .from('project_drafts')
        .select('*')
        .eq('brand_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching draft:', error);
        throw error;
      }

      console.log('Fetched draft:', data);
      return data;
    },
    enabled: !!userId
  });

  // Save draft mutation
  const saveDraftMutation = useMutation({
    mutationFn: async (data: Partial<CampaignWizardData>) => {
      if (!userId) {
        console.error('No user ID available for draft save');
        throw new Error('No user authenticated');
      }

      console.log('Saving draft data:', data);
      
      // Serialize the data properly, handling dates and other complex objects
      const serializedData = JSON.stringify(data, (key, value) => {
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      });

      // Check if data has actually changed
      if (serializedData === lastSavedDataRef.current) {
        console.log('Data unchanged, skipping save');
        return;
      }

      if (existingDraft?.id) {
        console.log('Updating existing draft:', existingDraft.id);
        const { error } = await supabase
          .from('project_drafts')
          .update({
            draft_data: serializedData,
            current_step: currentStep,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingDraft.id)
          .eq('brand_id', userId);

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
            brand_id: userId,
            draft_data: serializedData,
            current_step: currentStep
          });

        if (error) {
          console.error('Error creating draft:', error);
          throw error;
        }
        console.log('Draft created successfully');
      }

      // Update the last saved data reference
      lastSavedDataRef.current = serializedData;
    },
    onSuccess: () => {
      console.log('Draft save successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['campaign-draft'] });
    },
    onError: (error) => {
      console.error('Draft save failed:', error);
    }
  });

  // Auto-save function with debouncing and change detection
  const triggerAutoSave = (data: Partial<CampaignWizardData>) => {
    // Don't auto-save while loading draft data
    if (isLoadingDraftRef.current || isDraftLoading) {
      console.log('Skipping auto-save: draft is loading');
      return;
    }

    // Serialize to check for changes
    const serializedData = JSON.stringify(data, (key, value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    });

    // Skip if data hasn't changed
    if (serializedData === lastSavedDataRef.current) {
      console.log('No changes detected, skipping auto-save');
      return;
    }

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

    if (hasData && userId && !isLoadingDraftRef.current && !isDraftLoading) {
      console.log('Form data changed, triggering auto-save');
      triggerAutoSave(formData);
    }

    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [formData, userId]);

  // Auto-save when step changes
  useEffect(() => {
    const hasData = formData && Object.keys(formData).length > 0;
    if (hasData && userId && !isLoadingDraftRef.current && !isDraftLoading) {
      console.log('Step changed, triggering auto-save');
      triggerAutoSave(formData);
    }
  }, [currentStep]);

  // Track when draft is loading
  useEffect(() => {
    isLoadingDraftRef.current = isDraftLoading;
  }, [isDraftLoading]);

  // Manual save function
  const saveDraft = async () => {
    console.log('Manual save triggered');
    if (!formData || Object.keys(formData).length === 0) {
      console.log('No data to save');
      return;
    }
    return saveDraftMutation.mutateAsync(formData);
  };

  // Clear draft when campaign is published
  const clearDraft = async () => {
    if (existingDraft?.id && userId) {
      console.log('Clearing draft');
      const { error } = await supabase
        .from('project_drafts')
        .delete()
        .eq('id', existingDraft.id)
        .eq('brand_id', userId);

      if (error) {
        console.error('Error clearing draft:', error);
      } else {
        console.log('Draft cleared successfully');
        lastSavedDataRef.current = '';
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
