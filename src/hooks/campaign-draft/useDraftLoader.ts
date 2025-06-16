
import { useEffect, useRef } from 'react';
import { CampaignWizardData } from '@/types/campaignWizard';

export const useDraftLoader = (
  existingDraft: any,
  setFormData: (data: Partial<CampaignWizardData>) => void,
  setCurrentStep: (step: number) => void
) => {
  const hasLoadedRef = useRef(false);

  const loadDraft = () => {
    if (existingDraft?.draft_data && !hasLoadedRef.current) {
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
        
        hasLoadedRef.current = true;
        console.log('Draft loaded successfully');
      } catch (error) {
        console.error('Error parsing draft data:', error);
      }
    }
  };

  // Auto-load draft when it becomes available, but only once
  useEffect(() => {
    if (existingDraft && !hasLoadedRef.current) {
      loadDraft();
    }
  }, [existingDraft]);

  return { loadDraft };
};
