
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export function useEmailConfirmation() {
  useEffect(() => {
    const checkConfirmation = async () => {
      const url = new URL(window.location.href);
      const isConfirmation = url.searchParams.get('confirmation');
      
      if (isConfirmation === 'true') {
        // Handle email confirmation
        try {
          const { error } = await supabase.auth.getUser();
          if (!error) {
            toast.success('Email successfully confirmed! You can now log in.');
          } else {
            console.error('Error confirming email:', error);
            toast.error('Failed to confirm email. Please try again.');
          }
        } catch (error) {
          console.error('Error confirming email:', error);
          toast.error('Failed to confirm email. Please try again.');
        }
        
        // Clean up URL
        window.history.replaceState({}, document.title, '/auth');
      }
    };
    
    checkConfirmation();
  }, []);
}
