
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

export function useEmailConfirmation() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkConfirmation = async () => {
      // Check if this is a confirmation link from email
      const url = new URL(window.location.href);
      const isConfirmation = url.hash.includes('#access_token=') || url.searchParams.get('confirmation') === 'true';
      
      if (isConfirmation) {
        try {
          console.log('Detected confirmation link');
          
          // Get the session from the hash fragment if present
          if (url.hash.includes('#access_token=')) {
            // This means the user clicked on the email confirmation link
            // The session is created automatically by Supabase
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) {
              console.error('Error getting session:', sessionError);
              toast.error('Error confirming email. Please try logging in.');
              navigate('/auth');
              return;
            }
            
            if (!session) {
              console.error('No session found after confirmation');
              toast.error('Email confirmation failed. Please try logging in directly.');
              navigate('/auth');
              return;
            }
            
            console.log('Session found after confirmation:', session);
            
            // User is now authenticated after clicking the confirmation link
            const userId = session.user.id;
            
            // Update user_roles status to approved
            const { error: roleError } = await supabase
              .from('user_roles')
              .update({ status: 'approved' })
              .eq('user_id', userId);
              
            if (roleError) {
              console.error('Error updating role status:', roleError);
              toast.error('Error updating account status. Your account is confirmed but you may need to contact support.');
            }
            
            // Get user role from profiles
            const { data: userData, error: userError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', userId)
              .single();
              
            if (userError) {
              console.error('Error fetching user role:', userError);
            }
            
            // Special handling for brand accounts
            if (userData?.role === 'brand') {
              console.log('Confirming brand account');
              // Check if the profile is already marked as complete
              const { data: brandProfile, error: brandCheckError } = await supabase
                .from('profiles')
                .select('is_complete, company_name') // Include company_name in the query
                .eq('id', userId)
                .eq('role', 'brand')
                .maybeSingle();
                
              if (brandCheckError) {
                console.error('Error checking brand profile:', brandCheckError);
              }
              
              // If is_complete is not true, update the profile
              if (brandProfile && !brandProfile.is_complete) {
                console.log('Updating brand profile for confirmed user');
                const { error: updateError } = await supabase
                  .from('profiles')
                  .update({
                    company_name: brandProfile.company_name || 'My Brand',
                    is_complete: false
                  })
                  .eq('id', userId);
                
                if (updateError) {
                  console.error('Failed to update brand profile:', updateError);
                }
              }
            }
            
            // Sign out the user so they can login with their confirmed credentials
            await supabase.auth.signOut();
            
            toast.success('Email confirmed successfully! You can now log in with your credentials.');
            
            // Redirect to auth page for login
            navigate('/auth');
          }
        } catch (error) {
          console.error('Error handling confirmation:', error);
          toast.error('Failed to process email confirmation. Please try logging in or contact support.');
          navigate('/auth');
        }
      }
    };
    
    checkConfirmation();
  }, [navigate]);
}
