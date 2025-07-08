
import { useRef, useEffect } from 'react';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';
import { CampaignWizardData } from '@/types/campaignWizard';
import { useDraftQuery } from './useDraftQuery';
import { useDraftMutation } from './useDraftMutation';
import { useDraftAutoSave } from './useDraftAutoSave';
import { useDraftClear } from './useDraftClear';

export const useDraftPersistence = (formData: Partial<CampaignWizardData>, currentStep: number) => {
  const { user, brandProfile } = useUnifiedAuth();
  const lastSavedDataRef = useRef<string>('');
  const isLoadingDraftRef = useRef(false);
  const isSavingRef = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Use user.id if brandProfile.user_id is not available
  const userId = brandProfile?.user_id || user?.id;

  // Fetch existing draft
  const { data: existingDraft, isLoading: isDraftLoading } = useDraftQuery(userId);

  // Save draft mutation
  const saveDraftMutation = useDraftMutation(
    userId,
    existingDraft,
    lastSavedDataRef,
    isSavingRef
  );

  // Draft clearing functionality
  const { clearDraft } = useDraftClear(userId, existingDraft, lastSavedDataRef);

  // Track when draft is loading
  useEffect(() => {
    isLoadingDraftRef.current = isDraftLoading;
  }, [isDraftLoading]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Manual save function with better error handling
  const saveDraft = async () => {
    console.log('Manual save triggered');
    
    // Clear any pending auto-save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    if (!formData || Object.keys(formData).length === 0) {
      console.log('No data to save');
      throw new Error('No data to save');
    }
    
    if (isSavingRef.current) {
      console.log('Save already in progress');
      return Promise.resolve(); // Return resolved promise instead of throwing
    }
    
    return saveDraftMutation.mutateAsync({ data: formData, currentStep });
  };

  // Auto-save functionality with debouncing
  useDraftAutoSave(formData, currentStep, saveDraft);

  return {
    existingDraft,
    isDraftLoading,
    saveDraft,
    clearDraft,
    isSaving: saveDraftMutation.isPending
  };
};
