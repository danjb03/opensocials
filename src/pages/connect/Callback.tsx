
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { toast } from '@/components/ui/sonner';
import { usePhylloScript } from '@/hooks/usePhylloScript';
import {
  createPhylloConfig,
  setupPhylloConnect
} from '@/utils/phylloConnectSetup';
import {
  getRedirectData,
  clearRedirectData,
  validateRedirectData
} from '@/utils/phylloRedirectData';
import { waitForPhylloReady } from '@/utils/phylloValidation';

const ConnectCallback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loadPhylloScript } = usePhylloScript();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resumeConnection = async () => {
      console.log('🔄 Processing Phyllo Connect callback');

      if (!user?.id) {
        console.warn('⚠️ No user found for callback, redirecting to creator page');
        navigate('/creator', { replace: true });
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      if (error) {
        console.error('❌ Phyllo callback error:', error);
        toast.error('Failed to connect social account. Please try again.');
        clearRedirectData();
        navigate('/creator');
        return;
      }

      if (!code || !state) {
        console.error('❌ Missing code or state in callback URL');
        toast.error('Invalid response from Phyllo. Please try again.');
        clearRedirectData();
        navigate('/creator');
        return;
      }

      const redirectData = getRedirectData();
      if (!redirectData || !validateRedirectData(redirectData, user.id)) {
        toast.error('Session expired. Please try connecting again.');
        clearRedirectData();
        navigate('/creator');
        return;
      }

      try {
        await loadPhylloScript();
        const ready = await waitForPhylloReady();
        if (!ready) {
          throw new Error('Phyllo Connect library failed to load');
        }

        const config = createPhylloConfig(user.id, redirectData.token);
        const phylloConnect = await setupPhylloConnect(
          config,
          user.id,
          () => {
            toast.success('Social account connected successfully!');
            navigate('/creator/dashboard', { replace: true });
          },
          setIsLoading
        );

        console.log('▶️ Resuming Phyllo Connect with state and code');
        await phylloConnect.resume({ code, state });
      } catch (err) {
        console.error('💥 Failed to resume Phyllo Connect:', err);
        toast.error('Failed to complete connection. Please try again.');
        navigate('/creator');
      } finally {
        clearRedirectData();
        setIsLoading(false);
      }
    };

    resumeConnection();
  }, [user, navigate, loadPhylloScript]);

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
