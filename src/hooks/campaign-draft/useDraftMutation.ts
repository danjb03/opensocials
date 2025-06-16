
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CampaignWizardData } from '@/types/campaignWizard';

export const useDraftMutation = (
  userId: string | undefined,
  existingDraft: any,
  lastSavedDataRef: React.MutableRefObject<string>,
  isSavingRef: React.MutableRefObject<boolean>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, currentStep }: { data: Partial<CampaignWizardData>; currentStep: number }) => {
      if (!userId) {
        console.error('No user ID available for draft save');
        throw new Error('No user authenticated');
      }

      if (isSavingRef.current) {
        console.log('Save already in progress, skipping');
        return;
      }

      isSavingRef.current = true;

      try {
        console.log('Saving draft data:', data);
        
        // Serialize the data properly, handling dates and other complex objects
        const serializedData = JSON.stringify(data, (key, value) => {
          if (value instanceof Date) {
            return value.toISOString();
          }
          // Handle undefined values
          if (value === undefined) {
            return null;
          }
          return value;
        });

        // Check if data has actually changed
        if (serializedData === lastSavedDataRef.current) {
          console.log('Data unchanged, skipping save');
          return;
        }

        const now = new Date().toISOString();

        if (existingDraft?.id) {
          console.log('Updating existing draft:', existingDraft.id);
          const { error } = await supabase
            .from('project_drafts')
            .update({
              draft_data: serializedData,
              current_step: currentStep,
              updated_at: now
            })
            .eq('id', existingDraft.id)
            .eq('brand_id', userId);

          if (error) {
            console.error('Error updating draft:', error);
            throw error;
          }
          console.log('Draft updated successfully');
        } else {
          console.log('Creating new draft');
          const { error } = await supabase
            .from('project_drafts')
            .insert({
              brand_id: userId,
              draft_data: serializedData,
              current_step: currentStep,
              created_at: now,
              updated_at: now
            });

          if (error) {
            console.error('Error creating draft:', error);
            throw error;
          }
          console.log('Draft created successfully');
        }

        // Update the last saved data reference
        lastSavedDataRef.current = serializedData;
      } finally {
        isSavingRef.current = false;
      }
    },
    onSuccess: () => {
      console.log('Draft save successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['campaign-draft'] });
    },
    onError: (error) => {
      console.error('Draft save failed:', error);
      isSavingRef.current = false;
    }
  });
};
