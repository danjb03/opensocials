
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBrandProfile } from '@/hooks/useBrandProfile';
import { CampaignWizardData } from '@/types/campaignWizard';

export const useCampaignDraft = () => {
  const { profile: brandProfile } = useBrandProfile();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CampaignWizardData>>({});

  // Fetch existing draft
  const { data: existingDraft, isLoading: isDraftLoading } = useQuery({
    queryKey: ['campaign-draft', brandProfile?.user_id],
    queryFn: async () => {
      if (!brandProfile?.user_id) return null;
      
      const { data, error } = await supabase
        .from('project_drafts')
        .select('*')
        .eq('brand_id', brandProfile.user_id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    },
    enabled: !!brandProfile?.user_id
  });

  // Save draft mutation
  const saveDraftMutation = useMutation({
    mutationFn: async (data: Partial<CampaignWizardData>) => {
      if (!brandProfile?.user_id) throw new Error('No brand profile');

      const draftData = JSON.stringify(data) as any;

      if (existingDraft?.id) {
        const { error } = await supabase
          .from('project_drafts')
          .update({
            draft_data: draftData,
            current_step: currentStep,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingDraft.id)
          .eq('brand_id', brandProfile.user_id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('project_drafts')
          .insert({
            brand_id: brandProfile.user_id,
            draft_data: draftData,
            current_step: currentStep
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-draft'] });
    }
  });

  // Auto-save when form data changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      const timeoutId = setTimeout(() => {
        saveDraftMutation.mutate(formData);
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [formData, saveDraftMutation]);

  // Load existing draft data on mount
  useEffect(() => {
    if (existingDraft?.draft_data) {
      try {
        const parsedData = typeof existingDraft.draft_data === 'string' 
          ? JSON.parse(existingDraft.draft_data)
          : existingDraft.draft_data;
        
        setFormData(parsedData);
        setCurrentStep(existingDraft.current_step || 1);
      } catch (error) {
        console.error('Error parsing draft data:', error);
      }
    }
  }, [existingDraft]);

  const updateFormData = (updates: Partial<CampaignWizardData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    setCurrentStep(Math.max(1, Math.min(step, 5)));
  };

  // Clear draft when campaign is published
  const clearDraft = async () => {
    if (existingDraft?.id && brandProfile?.user_id) {
      const { error } = await supabase
        .from('project_drafts')
        .delete()
        .eq('id', existingDraft.id)
        .eq('brand_id', brandProfile.user_id);

      if (error) {
        console.error('Error clearing draft:', error);
      } else {
        setFormData({});
        setCurrentStep(1);
        queryClient.invalidateQueries({ queryKey: ['campaign-draft'] });
      }
    }
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

  // Load existing draft from URL parameter if provided
  const loadDraft = async (draftId: string) => {
    if (!brandProfile?.user_id) return;
    
    const { data, error } = await supabase
      .from('project_drafts')
      .select('*')
      .eq('id', draftId)
      .eq('brand_id', brandProfile.user_id)
      .single();

    if (error) {
      console.error('Error loading draft:', error);
      return;
    }

    try {
      const parsedData = typeof data.draft_data === 'string' 
        ? JSON.parse(data.draft_data)
        : data.draft_data;
      
      setFormData(parsedData);
      setCurrentStep(data.current_step || 1);
    } catch (error) {
      console.error('Error parsing draft data:', error);
    }
  };

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
    saveDraft: () => saveDraftMutation.mutate(formData),
    isSaving: saveDraftMutation.isPending,
    
    // Section-specific getters
    getBasicsData,
    getContentData,
    getBudgetData,
    getReviewData,
    
    // Section-specific updaters
    updateBasicsData,
    updateContentData,
    updateBudgetData
  };
};
