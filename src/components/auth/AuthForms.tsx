
import { SignUpForm } from '@/components/auth/SignUpForm';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuthForm } from '@/hooks/useAuthForm';

interface AuthFormsProps {
  isSignUp: boolean;
  onToggleMode: () => void;
}

export function AuthForms({ isSignUp, onToggleMode }: AuthFormsProps) {
  const {
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
    handleSignUp,
    handleSignIn,
    handleForgotPassword,
  } = useAuthForm();

  // Combined auth handler for login form
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignIn();
  };

  // Wrapper for handleSignUp to convert Promise<boolean> to Promise<void>
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignUp(e);
    // Return void, not boolean
  };

  return (
    <>
      {isSignUp ? (
        <SignUpForm 
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          role={role}
          setRole={setRole}
          isLoading={isLoading}
          onSubmit={handleSignUpSubmit}
          onToggleMode={onToggleMode}
        />
      ) : (
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLoading={isLoading}
          onSubmit={handleAuth}
          onToggleMode={onToggleMode}
          onForgotPassword={handleForgotPassword}
        />
      )}
    </>
  );
}
