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

  // Save draft mutation - now using real database
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
      if (!brandProfile?.id) throw new Error('Brand profile required');

      // Try to save to database first
      try {
        let savedDraft;
        
        if (draftId) {
          // Update existing draft
          const { data: updateData, error } = await supabase
            .from('project_drafts')
            .update({
              draft_data: data,
              current_step: step,
              updated_at: new Date().toISOString()
            })
            .eq('id', draftId)
            .eq('brand_id', brandProfile.id)
            .select()
            .single();
          
          if (error) throw error;
          savedDraft = updateData;
        } else {
          // Create new draft
          const { data: insertData, error } = await supabase
            .from('project_drafts')
            .insert({
              brand_id: brandProfile.id,
              draft_data: data,
              current_step: step
            })
            .select()
            .single();
          
          if (error) throw error;
          savedDraft = insertData;
        }

        if (!silent) {
          toast.success('Draft saved successfully');
        }
        
        return savedDraft;
      } catch (error) {
        console.warn('Database save failed, falling back to localStorage:', error);
        
        // Fallback to localStorage
        const draftKey = `campaign_draft_${brandProfile?.user_id || 'temp'}`;
        const fallbackData = {
          data,
          current_step: step,
          updated_at: new Date().toISOString()
        };
        
        localStorage.setItem(draftKey, JSON.stringify(fallbackData));

        if (!silent) {
          toast.success('Draft saved locally');
        }
        
        return fallbackData;
      }
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
      
      try {
        // Try to delete from database
        const { error } = await supabase
          .from('project_drafts')
          .delete()
          .eq('id', draftId)
          .eq('brand_id', brandProfile?.id);
        
        if (error) throw error;
      } catch (error) {
        console.warn('Database delete failed, removing from localStorage:', error);
      }
      
      // Always clean up localStorage as well
      const draftKey = `campaign_draft_${brandProfile?.user_id || 'temp'}`;
      localStorage.removeItem(draftKey);
    }
  });

  // Load draft data from database or localStorage
  const loadDraft = useCallback(async () => {
    if (!brandProfile?.id) return;
    
    try {
      if (draftId) {
        // Load specific draft from database
        const { data: draftRecord, error } = await supabase
          .from('project_drafts')
          .select('*')
          .eq('id', draftId)
          .eq('brand_id', brandProfile.id)
          .single();
        
        if (error) throw error;
        
        if (draftRecord) {
          setDraftData(draftRecord.draft_data || {});
          setCurrentStep(draftRecord.current_step || 1);
          return;
        }
      } else {
        // Load latest draft for this brand
        const { data: latestDraft, error } = await supabase
          .from('project_drafts')
          .select('*')
          .eq('brand_id', brandProfile.id)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (error) throw error;
        
        if (latestDraft) {
          setDraftData(latestDraft.draft_data || {});
          setCurrentStep(latestDraft.current_step || 1);
          return;
        }
      }
    } catch (error) {
      console.warn('Database load failed, trying localStorage:', error);
    }
    
    // Fallback to localStorage
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
  }, [brandProfile?.id, brandProfile?.user_id, draftId]);

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