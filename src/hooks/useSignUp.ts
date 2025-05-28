
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { UserRole } from '@/lib/auth';

interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  setIsLoading: (loading: boolean) => void;
  resetForm: () => void;
}

export function useSignUp() {
  const handleSignUp = async ({
    email,
    password,
    firstName,
    lastName,
    role,
    setIsLoading,
    resetForm,
  }: SignUpParams): Promise<boolean> => {
    setIsLoading(true);
    console.log(`🆕 Signing up new ${role}...`);

    try {
      // Sign up the user with Supabase - the database trigger will handle profile creation
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role,
            // Include company_name for brands if needed
            ...(role === 'brand' && { company_name: `${firstName} ${lastName}'s Brand` })
          },
          emailRedirectTo: `${window.location.origin}/auth?confirmation=true`
        }
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('User already registered')) {
          toast.error('An account with this email already exists. Please try signing in instead.');
          return false;
        } else if (error.message.includes('Password should be')) {
          toast.error('Password must be at least 6 characters long.');
          return false;
        } else if (error.message.includes('Invalid email')) {
          toast.error('Please enter a valid email address.');
          return false;
        } else {
          throw error;
        }
      }

      if (data.user) {
        console.log('✅ Signup complete for user:', data.user.id);
        
        // Check if email was confirmed immediately (if email confirmation is disabled in Supabase)
        if (data.user.email_confirmed_at) {
          toast.success('Account created successfully! You can now log in.');
        } else {
          toast.success('Account created! Please check your email to confirm your account before logging in.');
        }
        
        resetForm();
        return true;
      } else {
        toast.error('Account creation failed. Please try again.');
        return false;
      }
    } catch (err: any) {
      console.error('❌ Signup failed:', err.message);
      
      // Handle network and other unexpected errors
      if (err.message?.includes('Failed to fetch') || err.message?.includes('network')) {
        toast.error('Network error. Please check your connection and try again.');
      } else if (err.message?.includes('sending email') || err.message?.includes('confirmation email')) {
        toast.success('Account created but there was an issue sending the confirmation email. Please contact support if you need help.');
        resetForm();
        return true; // Account was created successfully
      } else {
        toast.error(err.message || 'Signup failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }

    return false;
  };

  return { handleSignUp };
}
