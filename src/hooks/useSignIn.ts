
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

      if (error) throw error;

      // Check if email is confirmed
      if (!data.user.email_confirmed_at) {
        toast.error('Please confirm your email before logging in.');
        setIsLoading(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching user role:', profileError);
        toast.error('Failed to fetch user role.');
        return;
      }

      // Also check the user role status to ensure it's approved
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('status')
        .eq('user_id', data.user.id)
        .maybeSingle();
        
      if (roleError) {
        console.error('Error fetching role status:', roleError);
      }

      // If brand user and status is not approved, redirect to setup page
      if (profileData?.role === 'brand' && roleData?.status !== 'approved') {
        window.location.href = '/brand/setup-profile';
        return;
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
