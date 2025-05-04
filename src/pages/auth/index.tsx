
import { useEmailConfirmation } from '@/hooks/useEmailConfirmation';
import { useAuthPage } from '@/hooks/useAuthPage';
import Logo from '@/components/ui/logo';
import { AuthForms } from '@/components/auth/AuthForms';

const AuthPage = () => {
  const { isSignUp, toggleAuthMode } = useAuthPage();
  
  // Check for confirmation token in URL
  useEmailConfirmation();

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
        
        <AuthForms isSignUp={isSignUp} onToggleMode={toggleAuthMode} />
      </div>
    </div>
  );
};

export default AuthPage;
