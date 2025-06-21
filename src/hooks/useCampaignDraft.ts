
import { useDraftPersistence } from './campaign-draft/useDraftPersistence';
import { useDraftNavigation } from './campaign-draft/useDraftNavigation';
import { useDraftData } from './campaign-draft/useDraftData';
import { useDraftLoader } from './campaign-draft/useDraftLoader';

export const useCampaignDraft = () => {
  const { currentStep, setCurrentStep, nextStep, prevStep, goToStep } = useDraftNavigation();
  const { 
    formData, 
    setFormData, 
    updateFormData, 
    getBasicsData, 
    getBriefData, 
    getBudgetData, 
    getReviewData,
    updateBasicsData,
    updateBriefData,
    updateBudgetData 
  } = useDraftData();

  const { 
    existingDraft, 
    isDraftLoading, 
    saveDraft, 
    clearDraft, 
    isSaving 
  } = useDraftPersistence(formData, currentStep);

  const { loadDraft } = useDraftLoader(existingDraft, setFormData, setCurrentStep);

  return {
    currentStep,
    formData,
    isDraftLoading,
    existingDraft,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    clearDraft,
    loadDraft,
    saveDraft,
    isSaving,
    
    // Section-specific getters
    getBasicsData,
    getBriefData,
    getBudgetData,
    getReviewData,
    
    // Section-specific updaters
    updateBasicsData,
    updateBriefData,
    updateBudgetData
  };
};
