
import { useEffect } from 'react';
import { CampaignWizardData } from '@/types/campaignWizard';

export const useDraftLoader = (
  existingDraft: any,
  setFormData: (data: Partial<CampaignWizardData>) => void,
  setCurrentStep: (step: number) => void
) => {
  const loadDraft = () => {
    if (existingDraft?.draft_data) {
      try {
        console.log('Loading draft data:', existingDraft.draft_data);
        
        let parsedData;
        if (typeof existingDraft.draft_data === 'string') {
          parsedData = JSON.parse(existingDraft.draft_data);
        } else {
          parsedData = existingDraft.draft_data;
        }
        
        // Handle date parsing
        if (parsedData.timeline) {
          if (parsedData.timeline.start_date) {
            parsedData.timeline.start_date = new Date(parsedData.timeline.start_date);
          }
          if (parsedData.timeline.end_date) {
            parsedData.timeline.end_date = new Date(parsedData.timeline.end_date);
          }
        }
        
        console.log('Parsed draft data:', parsedData);
        setFormData(parsedData);
        
        if (existingDraft.current_step) {
          setCurrentStep(existingDraft.current_step);
        }
        
        console.log('Draft loaded successfully');
      } catch (error) {
        console.error('Error parsing draft data:', error);
      }
    }
  };

  // Auto-load draft when it becomes available
  useEffect(() => {
    if (existingDraft) {
      loadDraft();
    }
  }, [existingDraft]);

  return { loadDraft };
};
