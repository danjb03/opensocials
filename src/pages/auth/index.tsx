
import { useState } from 'react';
import Logo from '@/components/ui/logo';
import { useAuthForm } from '@/hooks/useAuthForm';
import { useEmailConfirmation } from '@/hooks/useEmailConfirmation';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { LoginForm } from '@/components/auth/LoginForm';

const AuthPage = () => {
  const {
    isLoading,
    isSignUp,
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
    toggleAuthMode,
    handleForgotPassword,
  } = useAuthForm();

  // Check for confirmation token in URL
  useEmailConfirmation();

  // Combined auth handler
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      await handleSignUp(e);
    } else {
      await handleSignIn();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
        </div>
        
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
            onSubmit={handleSignUp}
            onToggleMode={toggleAuthMode}
          />
        ) : (
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isLoading={isLoading}
            onSubmit={handleAuth}
            onToggleMode={toggleAuthMode}
            onForgotPassword={handleForgotPassword}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
