
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
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
      // Sign up the user with Supabase - this will trigger built-in email confirmation
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role
          },
          emailRedirectTo: `${window.location.origin}/auth?confirmation=true`
        }
      });

      if (error) throw error;

      if (data.user) {
        console.log('✅ Signup complete:', data.user.id);
        
        // Check if email was confirmed immediately (if email confirmation is disabled in Supabase)
        if (data.user.email_confirmed_at) {
          toast.success('Account created! You can now log in.');
        } else {
          toast.success('Account created! Please check your email to confirm your account.');
        }
        
        resetForm();
        return true;
      }
    } catch (err: any) {
      console.error('❌ Signup failed:', err.message);
      
      // Special handling for email sending errors
      if (err.message?.includes('sending email') || err.message?.includes('confirmation email')) {
        toast.error('Account created but there was an issue sending the confirmation email. Please check your Supabase email configuration.');
        resetForm();
        return true; // Return true since the account was created
      } else {
        toast.error(err.message || 'Signup failed. Try again.');
      }
    } finally {
      setIsLoading(false);
    }

    return false;
  };

  return { handleSignUp };
}
