
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { toast } from '@/components/ui/sonner';

const ConnectCallback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      console.log('🔄 Processing Phyllo Connect callback');
      
      // Check if we have the necessary user data
      if (!user?.id) {
        console.warn('⚠️ No user found for callback, redirecting to creator page');
        navigate('/creator', { replace: true });
        return;
      }

      // Check for success/failure URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get('status');
      const error = urlParams.get('error');
      
      if (error) {
        console.error('❌ Phyllo callback error:', error);
        toast.error('Failed to connect social account. Please try again.');
        navigate('/creator', { replace: true });
        return;
      }

      if (status === 'success') {
        console.log('✅ Phyllo connection successful');
        toast.success('Social account connected successfully!');
      } else {
        console.log('ℹ️ Phyllo callback completed');
        toast.info('Social account connection completed');
      }

      // Clean up any stored redirect data
      localStorage.removeItem('phyllo_redirect_data');
      
      // Always redirect back to creator dashboard
      navigate('/creator', { replace: true });
    };

    // Add a small delay to ensure the component is fully mounted
    const timer = setTimeout(handleCallback, 500);
    
    return () => clearTimeout(timer);
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <div className="space-y-2">
          <p className="text-lg font-medium">Processing Connection</p>
          <p className="text-muted-foreground">Please wait while we complete your social media connection...</p>
        </div>
      </div>
    </div>
  );
};

export default ConnectCallback;
