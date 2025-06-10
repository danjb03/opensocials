
import { useEmailConfirmation } from '@/hooks/useEmailConfirmation';
import { useAuthPage } from '@/hooks/useAuthPage';
import Logo from '@/components/ui/logo';
import { AuthForms } from '@/components/auth/AuthForms';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const { isSignUp, toggleAuthMode } = useAuthPage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Check if this is an invite link or confirmation link
  useEffect(() => {
    const isInvite = searchParams.get('setup') === 'true';
    const isConfirmation = searchParams.get('confirmation') === 'true' || window.location.hash.includes('#access_token=');
    
    if (isInvite || isConfirmation) {
      console.log('Invite or confirmation link detected, switching to login view');
      // If this is a confirmation or invite link, ensure we're in login mode
      if (isSignUp) {
        toggleAuthMode();
      }
      
      if (isInvite) {
        toast.info('Please set your password to complete your account setup.');
      } else if (window.location.hash.includes('#access_token=')) {
        toast.info('Processing your email confirmation...');
      } else {
        toast.info('Please log in with your credentials.');
      }
    }
  }, [isSignUp, toggleAuthMode, searchParams]);
  
  // Process email confirmation if needed
  useEmailConfirmation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-light text-white">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
        </div>
        
        <AuthForms isSignUp={isSignUp} onToggleMode={toggleAuthMode} />
      </div>
    </div>
  );
};

export default AuthPage;
