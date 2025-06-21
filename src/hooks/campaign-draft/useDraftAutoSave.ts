
import { useEffect } from 'react';
import { CampaignWizardData } from '@/types/campaignWizard';

export const useDraftAutoSave = (
  formData: Partial<CampaignWizardData>,
  currentStep: number,
  saveDraft: () => Promise<void>
) => {
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      // Only auto-save if we have meaningful data
      const hasBasicData = formData.name && formData.name.trim().length > 0;
      const hasBriefData = formData.brief_data && (
        formData.brief_data.product_description ||
        formData.brief_data.platform_destination?.length > 0
      );
      const hasBudgetData = formData.total_budget && formData.total_budget > 0;

      if (hasBasicData || hasBriefData || hasBudgetData) {
        saveDraft().catch(console.error);
      }
    }, 3000); // Auto-save after 3 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [formData, currentStep, saveDraft]);
};
