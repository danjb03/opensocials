import { supabase } from '@/integrations/supabase/client';

/**
 * Delete a campaign by ID.
 * Returns { success: boolean, error?: any }
 */
export const deleteCampaign = async (campaignId: string) => {
  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', campaignId)
    .single();

  if (error) {
    console.error('Error deleting campaign:', error);
    return { success: false, error };
  }

  return { success: true };
};
