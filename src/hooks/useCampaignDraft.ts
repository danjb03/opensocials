
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CampaignWizardData, ProjectDraft } from '@/types/campaignWizard';
import { useAuth } from '@/lib/auth';

export function useCampaignDraft(draftId?: string) {
  const [draft, setDraft] = useState<ProjectDraft | null>(null);
  const [draftData, setDraftData] = useState<CampaignWizardData>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      loadDraft();
    }
  }, [user?.id, draftId]);

  const loadDraft = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      if (draftId) {
        // Load specific draft
        const { data, error } = await supabase
          .from('project_drafts')
          .select('*')
          .eq('id', draftId)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          const draftData = data.draft_data as CampaignWizardData;
          setDraft(data);
          setDraftData(draftData);
          setCurrentStep(data.current_step || 1);
        }
      } else {
        // Load latest draft for user
        const { data, error } = await supabase
          .from('project_drafts')
          .select('*')
          .eq('brand_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (data) {
          const draftData = data.draft_data as CampaignWizardData;
          setDraft(data);
          setDraftData(draftData);
          setCurrentStep(data.current_step || 1);
        }
      }
    } catch (error) {
      console.error('Error loading draft:', error);
      toast({
        title: 'Error',
        description: 'Failed to load campaign draft',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveDraft = async (data: Partial<CampaignWizardData>, step: number) => {
    if (!user?.id) return;
    
    try {
      const updatedData = { ...draftData, ...data };
      setDraftData(updatedData);
      setCurrentStep(step);

      if (draft) {
        // Update existing draft
        const { error } = await supabase
          .from('project_drafts')
          .update({
            draft_data: updatedData,
            current_step: step,
            updated_at: new Date().toISOString()
          })
          .eq('id', draft.id);

        if (error) throw error;

        setDraft({
          ...draft,
          draft_data: updatedData,
          current_step: step
        });
      } else {
        // Create new draft
        const { data: newDraft, error } = await supabase
          .from('project_drafts')
          .insert({
            brand_id: user.id,
            draft_data: updatedData,
            current_step: step
          })
          .select()
          .single();

        if (error) throw error;

        setDraft(newDraft);
      }

      toast({
        title: 'Draft saved',
        description: 'Your campaign progress has been saved',
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: 'Error',
        description: 'Failed to save campaign draft',
        variant: 'destructive',
      });
    }
  };

  const createProject = async (data: CampaignWizardData): Promise<string> => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      // Create project in projects_new table
      const { data: newProject, error } = await supabase
        .from('projects_new')
        .insert({
          brand_id: user.id,
          name: data.campaign_name || data.name || 'Untitled Campaign',
          campaign_type: data.campaign_type || 'Single',
          objective: data.objective,
          description: data.description,
          content_requirements: data.content_requirements as any,
          messaging_guidelines: data.messaging_guidelines,
          start_date: data.start_date,
          end_date: data.end_date,
          budget: data.total_budget || data.budget,
          currency: data.currency || 'USD',
          deliverables: data.deliverables as any,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      return newProject.id;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  const clearDraft = async () => {
    if (!draft) return;
    
    try {
      const { error } = await supabase
        .from('project_drafts')
        .delete()
        .eq('id', draft.id);

      if (error) throw error;

      setDraft(null);
      setDraftData({});
      setCurrentStep(1);
      
      toast({
        title: 'Draft cleared',
        description: 'Campaign draft has been removed',
      });
    } catch (error) {
      console.error('Error clearing draft:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear campaign draft',
        variant: 'destructive',
      });
    }
  };

  const deleteDraft = async () => {
    return clearDraft();
  };

  return {
    draft,
    draftData,
    setDraftData,
    currentStep,
    setCurrentStep,
    isLoading,
    saveDraft,
    clearDraft,
    loadDraft,
    createProject,
    deleteDraft
  };
}
