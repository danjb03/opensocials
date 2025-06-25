
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { validateEmail } from '@/utils/security';
import { clearAuthState } from '@/utils/getUserRole';

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

      console.log('🔐 Attempting sign in for:', email);

      // Clear any stale auth state before signing in
      clearAuthState();

      // Attempt global sign out first to ensure clean state
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (signOutError) {
        // Continue even if this fails
        console.warn('Global sign out failed, continuing:', signOutError);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('❌ Sign in error:', error.message);
        
        // Enhanced error handling
        if (error.message.includes("Email not confirmed")) {
          toast.error('Your email is not confirmed. Please check your inbox and click the confirmation link.');
          
          // Offer resend confirmation option
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: email.trim().toLowerCase(),
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

      // Check if email is confirmed
      if (!data.user?.email_confirmed_at) {
        toast.error('Please confirm your email before logging in.');
        
        // Resend confirmation email
        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email: email.trim().toLowerCase(),
        });
        
        if (!resendError) {
          toast.info('A new confirmation email has been sent to your address.');
        }
        
        setIsLoading(false);
        return;
      }

      console.log('✅ Sign in successful for user:', data.user.id);
      toast.success('Welcome back!');

      // Force a page refresh to ensure clean auth state
      setTimeout(() => {
        window.location.href = '/';
      }, 500);

    } catch (err: any) {
      console.error('❌ Login error:', err.message);
      
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
