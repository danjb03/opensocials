
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface ForgotPasswordParams {
  email: string;
}

export function useForgotPassword() {
  const handleForgotPassword = async ({ email }: ForgotPasswordParams) => {
    if (!email) {
      toast.error('Please enter your email first.');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success('Check your email for reset instructions.');
    } catch (err: any) {
      toast.error(err.message || 'Password reset failed.');
    }
  };

  return { handleForgotPassword };
}
