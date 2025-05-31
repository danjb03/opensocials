
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CampaignWizardData } from '@/types/campaignWizard';
import { useAuth } from '@/lib/auth';

interface ProjectDraft {
  id: string;
  brand_id: string;
  draft_data: CampaignWizardData;
  current_step: number;
  created_at: string;
  updated_at: string;
}

export function useCampaignDraft() {
  const [draft, setDraft] = useState<ProjectDraft | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      loadDraft();
    }
  }, [user?.id]);

  const loadDraft = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      // For now, we'll use the regular projects table since project_drafts might not be in types yet
      // This is a temporary workaround until the database types are regenerated
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('brand_id', user.id)
        .eq('status', 'draft')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }

      if (data) {
        // Transform the project data to match our draft format
        const draftData: CampaignWizardData = {
          campaign_name: data.name,
          campaign_type: data.campaign_type,
          objective: data.objective || 'brand_awareness',
          description: data.description || '',
          content_requirements: data.content_requirements || {},
          messaging_guidelines: data.messaging_guidelines || '',
          start_date: data.start_date || '',
          end_date: data.end_date || '',
          total_budget: data.budget || 0,
          currency: data.currency || 'USD',
          deliverables: data.deliverables || {},
          selected_creators: []
        };

        setDraft({
          id: data.id,
          brand_id: data.brand_id,
          draft_data: draftData,
          current_step: data.current_step || 1,
          created_at: data.created_at,
          updated_at: data.updated_at
        });
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

  const saveDraft = async (data: Partial<CampaignWizardData>, currentStep: number) => {
    if (!user?.id) return;
    
    try {
      if (draft) {
        // Update existing draft
        const updatedData = { ...draft.draft_data, ...data };
        
        const { error } = await supabase
          .from('projects')
          .update({
            name: updatedData.campaign_name,
            campaign_type: updatedData.campaign_type,
            objective: updatedData.objective,
            description: updatedData.description,
            content_requirements: updatedData.content_requirements,
            messaging_guidelines: updatedData.messaging_guidelines,
            start_date: updatedData.start_date,
            end_date: updatedData.end_date,
            budget: updatedData.total_budget,
            currency: updatedData.currency,
            deliverables: updatedData.deliverables,
            current_step: currentStep,
            updated_at: new Date().toISOString()
          })
          .eq('id', draft.id);

        if (error) throw error;

        setDraft({
          ...draft,
          draft_data: updatedData,
          current_step: currentStep
        });
      } else {
        // Create new draft
        const newData: CampaignWizardData = {
          campaign_name: data.campaign_name || '',
          campaign_type: data.campaign_type || 'Single',
          objective: data.objective || 'brand_awareness',
          description: data.description || '',
          content_requirements: data.content_requirements || {},
          messaging_guidelines: data.messaging_guidelines || '',
          start_date: data.start_date || '',
          end_date: data.end_date || '',
          total_budget: data.total_budget || 0,
          currency: data.currency || 'USD',
          deliverables: data.deliverables || {},
          selected_creators: data.selected_creators || []
        };

        const { data: newDraft, error } = await supabase
          .from('projects')
          .insert({
            brand_id: user.id,
            name: newData.campaign_name,
            campaign_type: newData.campaign_type,
            objective: newData.objective,
            description: newData.description,
            content_requirements: newData.content_requirements,
            messaging_guidelines: newData.messaging_guidelines,
            start_date: newData.start_date,
            end_date: newData.end_date,
            budget: newData.total_budget,
            currency: newData.currency,
            deliverables: newData.deliverables,
            current_step: currentStep,
            status: 'draft'
          })
          .select()
          .single();

        if (error) throw error;

        setDraft({
          id: newDraft.id,
          brand_id: newDraft.brand_id,
          draft_data: newData,
          current_step: currentStep,
          created_at: newDraft.created_at,
          updated_at: newDraft.updated_at
        });
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

  const clearDraft = async () => {
    if (!draft) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', draft.id);

      if (error) throw error;

      setDraft(null);
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

  return {
    draft,
    isLoading,
    saveDraft,
    clearDraft,
    loadDraft
  };
}
