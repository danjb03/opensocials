
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useEmailConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Process hash parameters which could contain access_token, etc.
    const handleEmailConfirmation = async () => {
      // Check if we have a hash in the URL (indicates email confirmation)
      if (window.location.hash && window.location.hash.includes('access_token')) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        if (accessToken && type) {
          try {
            // Set the session from the hash params
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });
            
            if (error) throw error;
            
            if (data?.user) {
              // Clear the hash from URL
              window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
              
              toast.success('Email confirmed successfully! You are now logged in.');
              navigate('/'); // Redirect to home or dashboard
            }
          } catch (err: any) {
            console.error('Error handling email confirmation:', err);
            toast.error('Failed to confirm email: ' + (err.message || 'Unknown error'));
          }
        }
      }

      // Handle explicit confirmation param
      const isConfirmation = searchParams.get('confirmation') === 'true';
      if (isConfirmation) {
        toast.info('Please sign in to continue.');
      }
    };

    handleEmailConfirmation();
  }, [navigate, searchParams]);

  return null;
}
