
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { usePhylloConnect } from '@/hooks/usePhylloConnect';

const ConnectCallback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { initializePhylloConnect } = usePhylloConnect(
    user?.id,
    user?.email,
    () => {
      // On successful connection, redirect back to creator dashboard
      navigate('/creator', { replace: true });
    }
  );

  useEffect(() => {
    const handleRedirectCallback = async () => {
      console.log('🔄 Handling Phyllo redirect callback');
      
      // Check if we have the necessary user data
      if (!user?.id) {
        console.warn('⚠️ No user found for redirect callback, redirecting to creator page');
        navigate('/creator', { replace: true });
        return;
      }

      // Add phyllo_return parameter and redirect to creator page to trigger the resume logic
      navigate('/creator?phyllo_return=true', { replace: true });
    };

    handleRedirectCallback();
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing your social media connection...</p>
      </div>
    </div>
  );
};

export default ConnectCallback;
