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
        toast.success('Account created! Confirm via email before logging in.');
        resetForm();
        return true;
      }
    } catch (err: any) {
      console.error('❌ Signup failed:', err.message);
      toast.error(err.message || 'Signup failed. Try again.');
    } finally {
      setIsLoading(false);
    }

    return false;
  };

  return { handleSignUp };
}
