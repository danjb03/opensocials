import { useState, useCallback, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { CampaignWizardData } from '@/types/campaignWizard';
import { toast } from 'sonner';

export const useCampaignDraft = (draftId?: string) => {
  const { brandProfile } = useUnifiedAuth();
  const queryClient = useQueryClient();
  
  const [draftData, setDraftData] = useState<Partial<CampaignWizardData>>({});
  const [currentStep, setCurrentStep] = useState(1);

  // Auto-save timer
  useEffect(() => {
    if (!draftData || Object.keys(draftData).length === 0) return;
    
    const timer = setTimeout(() => {
      saveDraftMutation.mutate({ 
        data: draftData, 
        step: currentStep,
        silent: true 
      });
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(timer);
  }, [draftData, currentStep]);

  // Save draft mutation - using localStorage for now since tables don't exist yet
  const saveDraftMutation = useMutation({
    mutationFn: async ({ 
      data, 
      step, 
      silent = false 
    }: { 
      data: Partial<CampaignWizardData>; 
      step: number; 
      silent?: boolean;
    }) => {
      // For now, save to localStorage until database tables are ready
      const draftKey = `campaign_draft_${brandProfile?.user_id || 'temp'}`;
      const draftData = {
        data,
        current_step: step,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem(draftKey, JSON.stringify(draftData));

      if (!silent) {
        toast.success('Draft saved successfully');
      }
      
      return draftData;
    },
    onError: (error) => {
      console.error('Draft save error:', error);
      toast.error('Failed to save draft');
    }
  });

  // Create final project mutation - using edge function
  const createProjectMutation = useMutation({
    mutationFn: async (campaignData: CampaignWizardData) => {
      if (!brandProfile?.user_id) throw new Error('Brand profile required');

      // Call edge function to create campaign with deals
      const { data, error } = await supabase.functions.invoke('create-campaign-with-deals', {
        body: {
          name: campaignData.name,
          objective: campaignData.objective,
          campaign_type: campaignData.campaign_type,
          description: campaignData.description,
          content_requirements: campaignData.content_requirements,
          messaging_guidelines: campaignData.messaging_guidelines,
          total_budget: campaignData.total_budget,
          deliverables: campaignData.deliverables,
          start_date: campaignData.timeline.start_date?.toISOString().split('T')[0],
          end_date: campaignData.timeline.end_date?.toISOString().split('T')[0],
          selected_creators: campaignData.selected_creators || []
        }
      });

      if (error) throw error;
      return data.project_id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand-projects'] });
      toast.success('🚀 Campaign created successfully!');
    },
    onError: (error) => {
      console.error('Project creation error:', error);
      toast.error('Failed to create campaign');
    }
  });

  // Delete draft mutation
  const deleteDraftMutation = useMutation({
    mutationFn: async () => {
      if (!draftId) return;
      
      // For now, delete from localStorage
      const draftKey = `campaign_draft_${brandProfile?.user_id || 'temp'}`;
      localStorage.removeItem(draftKey);
    }
  });

  // Load draft data from localStorage
  const loadDraft = useCallback(() => {
    const draftKey = `campaign_draft_${brandProfile?.user_id || 'temp'}`;
    const savedDraft = localStorage.getItem(draftKey);
    
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setDraftData(parsed.data || {});
        setCurrentStep(parsed.current_step || 1);
      } catch (error) {
        console.error('Failed to parse saved draft:', error);
      }
    }
  }, [brandProfile?.user_id]);

  // Save draft function
  const saveDraft = useCallback(
    async (data: Partial<CampaignWizardData>, step: number, silent = false) => {
      return saveDraftMutation.mutateAsync({ data, step, silent });
    },
    [saveDraftMutation]
  );

  // Create project function
  const createProject = useCallback(
    async (data: CampaignWizardData) => {
      return createProjectMutation.mutateAsync(data);
    },
    [createProjectMutation]
  );

  // Delete draft function
  const deleteDraft = useCallback(
    async () => {
      return deleteDraftMutation.mutateAsync();
    },
    [deleteDraftMutation]
  );

  return {
    draftData,
    setDraftData,
    currentStep,
    setCurrentStep,
    isLoading: saveDraftMutation.isPending || createProjectMutation.isPending,
    loadDraft,
    saveDraft,
    createProject,
    deleteDraft,
    isCreatingProject: createProjectMutation.isPending,
    draftId
  };
};