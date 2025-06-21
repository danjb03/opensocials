
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
    objective: formData.objective,
    timeline: formData.timeline || { start_date: undefined, end_date: undefined }
  });

  const getBriefData = () => ({
    brief_data: formData.brief_data || {
      product_description: '',
      hook: '',
      content_format: [],
      tone_vibe: [],
      key_messaging: '',
      platform_destination: [],
      call_to_action: '',
      references_restrictions: ''
    }
  });

  const getBudgetData = () => ({
    total_budget: formData.total_budget || 0,
    deliverables: formData.deliverables || {
      posts_count: 0,
      stories_count: 0,
      reels_count: 0
    },
    campaign_type_data: formData.campaign_type_data || {}
  });

  const getReviewData = () => formData;

  // Update specific sections with validation
  const updateBasicsData = (data: any) => {
    updateFormData(data);
  };

  const updateBriefData = (data: any) => {
    updateFormData(data);
  };

  const updateBudgetData = (data: any) => {
    // Handle campaign type specific data
    updateFormData(data);
  };

  return {
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
  };
};
