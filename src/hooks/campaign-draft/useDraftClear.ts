
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export const useDraftClear = (
  userId: string | undefined,
  existingDraft: any,
  lastSavedDataRef: React.MutableRefObject<string>
) => {
  const queryClient = useQueryClient();

  const clearDraft = async () => {
    if (existingDraft?.id && userId) {
      console.log('Clearing draft');
      const { error } = await supabase
        .from('project_drafts')
        .delete()
        .eq('id', existingDraft.id)
        .eq('brand_id', userId);

      if (error) {
        console.error('Error clearing draft:', error);
        throw error;
      } else {
        console.log('Draft cleared successfully');
        lastSavedDataRef.current = '';
        queryClient.invalidateQueries({ queryKey: ['campaign-draft'] });
      }
    }
  };

  return { clearDraft };
};
