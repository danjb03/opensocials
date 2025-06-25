
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { validateEmail } from '@/utils/security';

interface ForgotPasswordParams {
  email: string;
}

export function useForgotPassword() {
  const handleForgotPassword = async ({ email }: ForgotPasswordParams) => {
    try {
      // Client-side validation
      if (!validateEmail(email)) {
        toast.error('Please enter a valid email address.');
        return;
      }

      console.log('🔐 Sending password reset for:', email);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`
      });

      if (error) {
        console.error('❌ Password reset error:', error.message);
        
        if (error.message.includes('Email not found')) {
          toast.error('No account found with this email address.');
        } else if (error.message.includes('rate limit')) {
          toast.error('Too many requests. Please wait before trying again.');
        } else {
          toast.error('Failed to send reset email. Please try again.');
        }
        return;
      }

      console.log('✅ Password reset email sent');
      toast.success('Password reset email sent! Check your inbox.');

    } catch (err: any) {
      console.error('❌ Password reset failed:', err.message);
      toast.error('Failed to send reset email. Please try again.');
    }
  };

  return { handleForgotPassword };
}
