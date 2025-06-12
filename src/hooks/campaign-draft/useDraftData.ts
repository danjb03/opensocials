
import { useState, useEffect } from 'react';
import { CampaignWizardData } from '@/types/campaignWizard';

export const useDraftData = () => {
  const [formData, setFormData] = useState<Partial<CampaignWizardData>>({});

  const updateFormData = (updates: Partial<CampaignWizardData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Get specific form sections
  const getBasicsData = () => ({
    name: formData.name || '',
    description: formData.description || '',
    campaign_type: formData.campaign_type || 'Single',
    timeline: formData.timeline || { start_date: undefined, end_date: undefined }
  });

  const getContentData = () => ({
    content_requirements: formData.content_requirements || {
      content_types: [],
      platforms: [],
      messaging_guidelines: '',
      hashtags: [],
      mentions: [],
      style_preferences: '',
      restrictions: []
    },
    messaging_guidelines: formData.messaging_guidelines || ''
  });

  const getBudgetData = () => ({
    total_budget: formData.total_budget || 0,
    deliverables: formData.deliverables || {
      posts_count: 0,
      stories_count: 0,
      reels_count: 0
    }
  });

  const getReviewData = () => formData;

  // Update specific sections
  const updateBasicsData = (data: any) => {
    updateFormData(data);
  };

  const updateContentData = (data: any) => {
    updateFormData(data);
  };

  const updateBudgetData = (data: any) => {
    updateFormData(data);
  };

  return {
    formData,
    setFormData,
    updateFormData,
    getBasicsData,
    getContentData,
    getBudgetData,
    getReviewData,
    updateBasicsData,
    updateContentData,
    updateBudgetData
  };
};
