
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Database } from '@/integrations/supabase/types';

// Define a type for the allowed role values based on the database enum
type AppRole = Database['public']['Enums']['app_role'];

export const useRoleStatus = () => {
  // Update user role status to approved
  const updateUserRoleStatus = async (userId: string): Promise<boolean> => {
    try {
      console.log('Updating user role status for:', userId);
      
      // First check if the user role exists
      const exists = await checkUserRoleExists(userId);
      
      if (exists) {
        // Update existing role status to approved
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
      } else {
        // Create a new role entry with approved status
        console.log('No user role found, creating one with approved status');
        return await createUserRole(userId, 'brand');
      }
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
  const createUserRole = async (userId: string, role: AppRole): Promise<boolean> => {
    try {
      console.log('Creating user role for:', userId, 'with role:', role);
      const { error } = await supabase
        .from('user_roles')
        .insert({ 
          user_id: userId, 
          role: role,
          status: 'approved' // Explicitly set status to approved
        });
      
      if (error) {
        console.error('Failed to create user role:', error);
        toast.error('Failed to create user role');
        return false;
      }
      
      console.log('User role created successfully with approved status');
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
