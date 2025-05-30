
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { validateEmail } from '@/utils/security';

interface SignInParams {
  email: string;
  password: string;
  setIsLoading: (isLoading: boolean) => void;
}



export function useSignIn() {
  const handleSignIn = async ({ email, password, setIsLoading }: SignInParams) => {
    setIsLoading(true);
    
    try {
      // Client-side validation
      if (!validateEmail(email)) {
        toast.error('Please enter a valid email address.');
        setIsLoading(false);
        return;
      }

      if (!password || password.length < 6) {
        toast.error('Password must be at least 6 characters long.');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Enhanced error handling
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
        } else if (error.message.includes("Invalid login credentials")) {
          toast.error('Invalid email or password. Please check your credentials and try again.');
          setIsLoading(false);
          return;
        } else if (error.message.includes("Too many requests")) {
          toast.error('Too many login attempts. Please wait a moment before trying again.');
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

      // Continue with the rest of the sign in process using the new security function
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
      
      // Enhanced error handling for network issues
      if (err.message?.includes('Failed to fetch') || err.message?.includes('network')) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error(err.message || 'Login failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignIn };
}
