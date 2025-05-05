import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface SignInParams {
  email: string;
  password: string;
  setIsLoading: (isLoading: boolean) => void;
}

export function useSignIn() {
  const handleSignIn = async ({ email, password, setIsLoading }: SignInParams) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Special handling for unconfirmed email error
        if (error.message.includes("Email not confirmed")) {
          toast.error('Your email is not confirmed. Please check your inbox and click the confirmation link.');
          console.error('Login error - email not confirmed:', error.message);
          
          // Offer resend confirmation option
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: email,
          });
          
          if (!resendError) {
            toast.info('A new confirmation email has been sent to your address.');
          } else {
            console.error('Error resending confirmation email:', resendError);
          }
          
          setIsLoading(false);
          return;
        } else {
          throw error;
        }
      }

      // Check if email is confirmed - this is a double check even though Supabase should already prevent login
      if (!data.user.email_confirmed_at) {
        toast.error('Please confirm your email before logging in.');
        
        // Resend confirmation email
        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email: email,
        });
        
        if (!resendError) {
          toast.info('A new confirmation email has been sent to your address.');
        }
        
        setIsLoading(false);
        return;
      }

      // Continue with the rest of the sign in process
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_complete')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching user role:', profileError);
        toast.error('Failed to fetch user role.');
        return;
      }

      // For brand users, check if their profile is complete
      if (profileData?.role === 'brand') {
        console.log('Brand user logged in, checking profile completion:', profileData);
        
        // Only redirect to setup page if is_complete is explicitly false
        // Otherwise, go to the dashboard
        if (profileData.is_complete === false) {
          window.location.href = '/brand/setup-profile';
          setIsLoading(false);
          return;
        }
      }

      // Route based on role
      if (profileData?.role) {
        switch (profileData.role) {
          case 'super_admin':
            window.location.href = '/super-admin';
            break;
          case 'admin':
            window.location.href = '/admin';
            break;
          case 'brand':
            window.location.href = '/brand';
            break;
          case 'creator':
            window.location.href = '/creator';
            break;
          default:
            console.error('Unknown role:', profileData.role);
            toast.error('Invalid user role');
        }
      } else {
        toast.error('No role assigned.');
      }
    } catch (err: any) {
      console.error('Login error:', err.message);
      toast.error(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignIn };
}
