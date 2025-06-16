
import { useEffect, useState } from 'react';
import { CampaignWizardData } from '@/types/campaignWizard';

const AUTO_SAVE_DELAY = 5000; // 5 seconds to reduce frequency

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

  // Auto-save function with better debouncing and change detection
  const triggerAutoSave = (data: Partial<CampaignWizardData>) => {
    // Don't auto-save while loading draft data or already saving
    if (isLoadingDraftRef.current || isDraftLoading || isSavingRef.current) {
      console.log('Skipping auto-save: draft is loading or already saving');
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
      if (Object.keys(data).length > 0 && !isSavingRef.current) {
        console.log('Auto-saving draft after delay');
        triggerSave(data, currentStep);
      }
    }, AUTO_SAVE_DELAY);

    setAutoSaveTimeout(timeout);
  };

  // Auto-save when form data changes (with better validation)
  useEffect(() => {
    const hasMeaningfulData = formData && (
      formData.name || 
      formData.campaign_type || 
      formData.description || 
      formData.total_budget ||
      (formData.content_requirements?.platforms && formData.content_requirements.platforms.length > 0)
    );

    if (hasMeaningfulData && userId && !isLoadingDraftRef.current && !isDraftLoading) {
      console.log('Form data changed, triggering auto-save');
      triggerAutoSave(formData);
    }

    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [formData, userId]);

  // Auto-save when step changes (but only if we have data)
  useEffect(() => {
    const hasData = formData && Object.keys(formData).length > 0;
    if (hasData && userId && !isLoadingDraftRef.current && !isDraftLoading && !isSavingRef.current) {
      console.log('Step changed, triggering auto-save');
      triggerAutoSave(formData);
    }
  }, [currentStep]);

  return { triggerAutoSave };
};
