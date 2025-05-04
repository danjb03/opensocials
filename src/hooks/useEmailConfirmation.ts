
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

export function useEmailConfirmation() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkConfirmation = async () => {
      // Get the current URL parameters
      const url = new URL(window.location.href);
      const isConfirmation = url.hash.includes('#access_token=') || url.searchParams.get('confirmation') === 'true';
      const userId = url.searchParams.get('userId');
      
      if (isConfirmation) {
        try {
          // If we have a userId from the URL, use it directly
          // This allows our custom confirmation flow to work
          let userIdToUse = userId;
          
          if (!userIdToUse) {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
              console.error('Error getting current user:', error);
              toast.error('Error confirming email. Please try logging in first.');
              navigate('/auth');
              return;
            }
            
            if (user) {
              userIdToUse = user.id;
            }
          }
          
          if (!userIdToUse) {
            console.error('No user ID found for confirmation');
            toast.error('Could not determine which account to confirm. Please try logging in.');
            navigate('/auth');
            return;
          }
          
          console.log('Confirming email for user:', userIdToUse);
          
          // First, get the user's role to determine next steps
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userIdToUse)
            .single();
            
          if (userError) {
            console.error('Error fetching user role:', userError);
            toast.error('Could not confirm your account. Please contact support.');
            return;
          }
          
          console.log('User role:', userData?.role);
          
          // Update the user_roles table to set status to approved
          const { error: roleError } = await supabase
            .from('user_roles')
            .update({ status: 'approved' })
            .eq('user_id', userIdToUse);
            
          if (roleError) {
            console.error('Error updating role status:', roleError);
            toast.error('Error updating account status. Please contact support.');
            return;
          }
          
          // Special handling for brand accounts
          if (userData?.role === 'brand') {
            // Check if we need to create a brand profile
            const { data: brandProfile, error: brandCheckError } = await supabase
              .from('brand_profiles')
              .select('id')
              .eq('user_id', userIdToUse)
              .maybeSingle();
              
            if (brandCheckError) {
              console.error('Error checking brand profile:', brandCheckError);
            }
            
            // If no brand profile exists yet, create one
            if (!brandProfile) {
              console.log('Creating new brand profile during confirmation');
              const { error: createBrandError } = await supabase
                .from('brand_profiles')
                .upsert(
                  {
                    user_id: userIdToUse,
                    company_name: 'My Brand', // Default name until setup
                    is_complete: false
                  },
                  { onConflict: 'user_id' }
                );
              
              if (createBrandError) {
                console.error('Failed to create brand profile:', createBrandError);
                console.error('Error details:', JSON.stringify(createBrandError));
                toast.error('Failed to create brand profile. You may need to set it up manually.');
              } else {
                console.log('Brand profile created during confirmation');
              }
            } else {
              console.log('Brand profile already exists:', brandProfile);
            }
          }
          
          toast.success('Email successfully confirmed! Your account is now active. You can log in.');
          
          // Redirect to login view after a short delay
          setTimeout(() => {
            navigate('/auth');
          }, 2000);
        } catch (error) {
          console.error('Error confirming email:', error);
          toast.error('Failed to confirm email. Please try again or contact support.');
        }
        
        // Clean up URL
        if (url.hash.includes('#access_token=')) {
          window.history.replaceState({}, document.title, '/auth');
        }
      }
    };
    
    checkConfirmation();
  }, [navigate]);
}
