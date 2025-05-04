
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

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

  // Check if a user exists in user_roles table
  const checkUserRoleExists = async (userId: string): Promise<boolean> => {
    try {
      console.log('Checking if user role exists for:', userId);
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking user role:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error checking user role status:', error);
      return false;
    }
  };

  // Create user role if it doesn't exist
  const createUserRole = async (userId: string, role: string): Promise<boolean> => {
    try {
      console.log('Creating user role for:', userId, 'with role:', role);
      const { error } = await supabase
        .from('user_roles')
        .insert({ 
          user_id: userId, 
          role: role,
          status: 'approved' 
        });
      
      if (error) {
        console.error('Failed to create user role:', error);
        toast.error('Failed to create user role');
        return false;
      }
      
      console.log('User role created successfully');
      toast.success('User role created successfully');
      return true;
    } catch (error) {
      console.error('Error creating user role:', error);
      toast.error('Error creating user role');
      return false;
    }
  };

  return { 
    updateUserRoleStatus,
    checkUserRoleExists,
    createUserRole
  };
};
