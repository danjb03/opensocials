
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

      console.log('🔐 Attempting sign in for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
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

      // Check if email is confirmed
      if (!data.user?.email_confirmed_at) {
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

      console.log('✅ Sign in successful for user:', data.user.id);

      // Try to get role with improved error handling
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role, is_complete')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError) {
          // If it's a recursion error, still allow login but route based on metadata
          if (profileError.message?.includes('infinite recursion')) {
            console.warn('⚠️ Profile RLS recursion, using fallback routing');
            
            // Try to get role from user metadata
            const metadataRole = data.user.user_metadata?.role;
            if (metadataRole) {
              routeBasedOnRole(metadataRole);
            } else {
              // Default routing for super admin
              window.location.href = '/';
            }
            setIsLoading(false);
            return;
          } else {
            console.error('Error fetching user profile:', profileError);
            toast.error('Failed to fetch user profile.');
            setIsLoading(false);
            return;
          }
        }

        // Normal routing based on profile data
        if (profileData?.role) {
          routeBasedOnRole(profileData.role, profileData.is_complete);
        } else {
          console.warn('⚠️ No role found, redirecting to home');
          window.location.href = '/';
        }
      } catch (err) {
        console.error('Profile fetch failed:', err);
        // Fallback: redirect to home page
        window.location.href = '/';
      }
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

  const routeBasedOnRole = (role: string, isComplete?: boolean) => {
    console.log('🎯 Routing user with role:', role);
    
    // For brand users, check if their profile is complete
    if (role === 'brand' && isComplete === false) {
      window.location.href = '/brand/setup-profile';
      return;
    }

    // Route based on role
    switch (role) {
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
      case 'agency':
        window.location.href = '/agency';
        break;
      default:
        console.warn('❌ Unknown role:', role);
        window.location.href = '/';
    }
  };

  return { handleSignIn };
}
