
import { useAuthState } from '@/hooks/useAuthState';
import { useSignUp } from '@/hooks/useSignUp';
import { useSignIn } from '@/hooks/useSignIn';
import { useForgotPassword } from '@/hooks/useForgotPassword';
import type { UserRole } from '@/lib/auth';

export function useAuthForm() {
  const {
    isLoading,
    setIsLoading,
    email,
    setEmail,
    password,
    setPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    role,
    setRole,
    resetForm,
  } = useAuthState();

  const { handleSignUp: signUpHandler } = useSignUp();
  const { handleSignIn: signInHandler } = useSignIn();
  const { handleForgotPassword: forgotPasswordHandler } = useForgotPassword();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    return signUpHandler({
      email,
      password,
      firstName,
      lastName,
      role,
      setIsLoading,
      resetForm,
    });
  };

  const handleSignIn = async () => {
    await signInHandler({
      email,
      password,
      setIsLoading,
    });
  };

  const handleForgotPassword = async () => {
    await forgotPasswordHandler({ email });
  };

  return {
    isLoading,
    email,
    setEmail,
    password,
    setPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    role,
    setRole,
    resetForm,
    handleSignUp,
    handleSignIn,
    handleForgotPassword,
  };
}
