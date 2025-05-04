
import { supabase } from '@/integrations/supabase/client';

export const useRoleStatus = () => {
  // Update user role status to approved
  const updateUserRoleStatus = async (userId: string): Promise<boolean> => {
    try {
      console.log('Updating user role status for:', userId);
      const { error } = await supabase
        .from('user_roles')
        .update({ status: 'approved' })
        .eq('user_id', userId);
      
      if (error) {
        console.error('Failed to update user role status:', error);
        return false;
      }
      console.log('User role status updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating user role status:', error);
      return false;
    }
  };

  return { updateUserRoleStatus };
};
