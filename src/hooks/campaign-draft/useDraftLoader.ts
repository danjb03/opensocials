
import { useEffect, useRef } from 'react';
import { CampaignWizardData } from '@/types/campaignWizard';

export const useDraftLoader = (
  existingDraft: any,
  setFormData: (data: Partial<CampaignWizardData>) => void,
  setCurrentStep: (step: number) => void
) => {
  const hasLoadedRef = useRef(false);
  const loadTimeoutRef = useRef<NodeJS.Timeout>();

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
        
        // Handle date parsing with error handling
        if (parsedData.timeline) {
          try {
            if (parsedData.timeline.start_date) {
              parsedData.timeline.start_date = new Date(parsedData.timeline.start_date);
            }
            if (parsedData.timeline.end_date) {
              parsedData.timeline.end_date = new Date(parsedData.timeline.end_date);
            }
          } catch (dateError) {
            console.warn('Error parsing timeline dates:', dateError);
            // Reset timeline if dates are invalid
            parsedData.timeline = {
              start_date: undefined,
              end_date: undefined
            };
          }
        }
        
        console.log('Parsed draft data:', parsedData);
        
        // Set form data first
        setFormData(parsedData);
        
        // Then set the current step if available
        if (existingDraft.current_step && existingDraft.current_step > 0) {
          setCurrentStep(Math.min(existingDraft.current_step, 5)); // Ensure step is between 1-5
        }
        
        hasLoadedRef.current = true;
        console.log('Draft loaded successfully');
      } catch (error) {
        console.error('Error parsing draft data:', error);
        // Reset to prevent infinite load attempts
        hasLoadedRef.current = true;
      }
    }
  };

  // Auto-load draft when it becomes available, but only once
  useEffect(() => {
    if (existingDraft && !hasLoadedRef.current) {
      // Add small delay to prevent race conditions with form initialization
      loadTimeoutRef.current = setTimeout(() => {
        loadDraft();
      }, 100);
    }

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [existingDraft]);

  // Reset loaded flag when draft changes (new draft loaded)
  useEffect(() => {
    if (!existingDraft) {
      hasLoadedRef.current = false;
    }
  }, [existingDraft?.id]);

  return { loadDraft };
};
