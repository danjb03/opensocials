
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

export function useEmailConfirmation() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkConfirmation = async () => {
      const url = new URL(window.location.href);
      const isConfirmation = url.searchParams.get('confirmation');
      
      if (isConfirmation === 'true') {
        // Handle email confirmation
        try {
          const { data: { user }, error } = await supabase.auth.getUser();
          
          if (!error && user) {
            console.log('User confirmed email, updating role status');
            
            // Update the user_roles table to set status to approved for the user
            const { error: roleError } = await supabase
              .from('user_roles')
              .update({ status: 'approved' })
              .eq('user_id', user.id);
              
            if (roleError) {
              console.error('Error updating role status:', roleError);
              toast.error('Error updating account status. Please contact support.');
            } else {
              toast.success('Email successfully confirmed! Your account is now active. You can log in.');
              // Redirect to login view after a short delay
              setTimeout(() => {
                navigate('/auth');
              }, 2000);
            }
          } else {
            console.error('Error confirming email:', error);
            toast.error('Failed to confirm email. Please try again or contact support.');
          }
        } catch (error) {
          console.error('Error confirming email:', error);
          toast.error('Failed to confirm email. Please try again or contact support.');
        }
        
        // Clean up URL
        window.history.replaceState({}, document.title, '/auth');
      }
    };
    
    checkConfirmation();
  }, [navigate]);
}
