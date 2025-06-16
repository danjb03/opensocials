
import { useEffect, useState, useCallback } from 'react';
import { CampaignWizardData } from '@/types/campaignWizard';

const AUTO_SAVE_DELAY = 3000; // 3 seconds to reduce frequency

export const useDraftAutoSave = (
  formData: Partial<CampaignWizardData>,
  currentStep: number,
  userId: string | undefined,
  isDraftLoading: boolean,
  isLoadingDraftRef: React.MutableRefObject<boolean>,
  isSavingRef: React.MutableRefObject<boolean>,
  lastSavedDataRef: React.MutableRefObject<string>,
  triggerSave: (data: Partial<CampaignWizardData>, step: number) => void
) => {
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Memoized function to check if data has meaningful content
  const hasMeaningfulData = useCallback((data: Partial<CampaignWizardData>) => {
    return data && (
      (data.name && data.name.trim().length > 0) || 
      data.campaign_type || 
      (data.description && data.description.trim().length > 0) || 
      (data.total_budget && data.total_budget > 0) ||
      (data.content_requirements?.platforms && data.content_requirements.platforms.length > 0) ||
      (data.content_requirements?.content_types && data.content_requirements.content_types.length > 0)
    );
  }, []);

  // Auto-save function with better debouncing and change detection
  const triggerAutoSave = useCallback((data: Partial<CampaignWizardData>) => {
    // Don't auto-save while loading draft data or already saving
    if (isLoadingDraftRef.current || isDraftLoading || isSavingRef.current || !userId) {
      console.log('Skipping auto-save: draft is loading, already saving, or no user');
      return;
    }

    // Check if data has meaningful content
    if (!hasMeaningfulData(data)) {
      console.log('Skipping auto-save: no meaningful data');
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

    // Clear existing timeout
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    const timeout = setTimeout(() => {
      if (!isSavingRef.current && hasMeaningfulData(data)) {
        console.log('Auto-saving draft after delay');
        triggerSave(data, currentStep);
      }
    }, AUTO_SAVE_DELAY);

    setAutoSaveTimeout(timeout);
  }, [
    autoSaveTimeout, 
    currentStep, 
    hasMeaningfulData, 
    isDraftLoading, 
    isLoadingDraftRef, 
    isSavingRef, 
    lastSavedDataRef, 
    triggerSave, 
    userId
  ]);

  // Auto-save when form data changes (with better validation)
  useEffect(() => {
    if (userId && !isLoadingDraftRef.current && !isDraftLoading && hasMeaningfulData(formData)) {
      console.log('Form data changed, triggering auto-save');
      triggerAutoSave(formData);
    }

    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [formData, userId, isDraftLoading, triggerAutoSave, hasMeaningfulData, autoSaveTimeout]);

  // Auto-save when step changes (but only if we have data)
  useEffect(() => {
    if (hasMeaningfulData(formData) && userId && !isLoadingDraftRef.current && !isDraftLoading && !isSavingRef.current) {
      console.log('Step changed, triggering auto-save');
      triggerAutoSave(formData);
    }
  }, [currentStep, formData, hasMeaningfulData, isDraftLoading, isLoadingDraftRef, isSavingRef, triggerAutoSave, userId]);

  return { triggerAutoSave };
};
