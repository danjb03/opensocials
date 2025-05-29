
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { usePhylloScript } from '@/hooks/usePhylloScript';
import { createPhylloEventHandlers } from '@/components/creator/phyllo/PhylloEventHandlers';

const ConnectCallback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loadPhylloScript } = usePhylloScript();

  useEffect(() => {
    const handlePhylloCallback = async () => {
      console.log('🔄 Handling Phyllo Connect callback');
      
      // Check if we have the necessary user data
      if (!user?.id) {
        console.warn('⚠️ No user found for callback, redirecting to creator page');
        navigate('/creator', { replace: true });
        return;
      }

      try {
        // Get stored data from localStorage
        const storedData = localStorage.getItem('phyllo_redirect_data');
        if (!storedData) {
          console.warn('⚠️ No stored Phyllo data found');
          navigate('/creator', { replace: true });
          return;
        }

        const redirectData = JSON.parse(storedData);
        
        // Verify the stored userId matches current user
        if (redirectData.userId !== user.id) {
          console.warn('⚠️ Stored userId does not match current user');
          localStorage.removeItem('phyllo_redirect_data');
          navigate('/creator', { replace: true });
          return;
        }

        // Check if token is not expired (1 hour)
        const isTokenExpired = Date.now() - redirectData.timestamp > 3600000;
        if (isTokenExpired) {
          console.warn('⚠️ Stored token has expired');
          localStorage.removeItem('phyllo_redirect_data');
          navigate('/creator', { replace: true });
          return;
        }

        console.log('📜 Loading Phyllo script for callback handling...');
        await loadPhylloScript();
        
        // Wait for PhylloConnect to be ready
        const waitForPhylloReady = async (maxAttempts = 10): Promise<boolean> => {
          for (let i = 0; i < maxAttempts; i++) {
            if (window.PhylloConnect && typeof window.PhylloConnect.initialize === 'function') {
              return true;
            }
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          return false;
        };

        const isReady = await waitForPhylloReady();
        if (!isReady) {
          throw new Error('Phyllo Connect library failed to load properly');
        }

        console.log('🔄 Initializing Phyllo Connect for callback processing');
        
        const config = {
          clientDisplayName: "OpenSocials",
          environment: "staging",
          userId: redirectData.userId,
          token: redirectData.token,
          mode: "redirect"
        };

        const phylloConnect = await window.PhylloConnect.initialize(config);
        
        if (!phylloConnect || typeof phylloConnect.on !== 'function') {
          throw new Error('Failed to initialize Phyllo Connect - invalid instance');
        }

        const eventHandlers = createPhylloEventHandlers(
          redirectData.userId,
          () => {
            // Clean up and redirect on success
            localStorage.removeItem('phyllo_redirect_data');
            navigate('/creator', { replace: true });
          },
          () => {} // No loading state needed here
        );

        // Register event handlers
        phylloConnect.on('accountConnected', function (accountId, workplatformId, userIdFromEvent) {
          console.log('🟢 Account Connected in Callback:', { accountId, workplatformId, userIdFromEvent });
          eventHandlers.handleAccountConnected(accountId, workplatformId, userIdFromEvent);
        });

        phylloConnect.on('accountDisconnected', function (accountId, workplatformId, userIdFromEvent) {
          console.log('🔴 Account Disconnected in Callback:', { accountId, workplatformId, userIdFromEvent });
          eventHandlers.handleAccountDisconnected(accountId, workplatformId, userIdFromEvent);
        });

        phylloConnect.on('connectionFailure', function (reason, workplatformId, userIdFromEvent) {
          console.log('❌ Connection Failure in Callback:', { reason, workplatformId, userIdFromEvent });
          eventHandlers.handleConnectionFailure(reason, workplatformId, userIdFromEvent);
          localStorage.removeItem('phyllo_redirect_data');
          navigate('/creator', { replace: true });
        });

        phylloConnect.on('error', function (reason) {
          console.log('🚨 Phyllo Error in Callback:', reason);
          eventHandlers.handleError(reason);
          localStorage.removeItem('phyllo_redirect_data');
          navigate('/creator', { replace: true });
        });

        phylloConnect.on('exit', function (reason, workplatformId, userIdFromEvent) {
          console.log('🚪 Phyllo Exit in Callback:', { reason, workplatformId, userIdFromEvent });
          eventHandlers.handleExit(reason, workplatformId, userIdFromEvent);
          localStorage.removeItem('phyllo_redirect_data');
          navigate('/creator', { replace: true });
        });

        console.log('✅ Phyllo Connect callback handlers initialized');

      } catch (error) {
        console.error('💥 Error handling Phyllo callback:', error);
        localStorage.removeItem('phyllo_redirect_data');
        navigate('/creator', { replace: true });
      }
    };

    handlePhylloCallback();
  }, [user, navigate, loadPhylloScript]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Processing your social media connection...</p>
        <p className="text-sm text-muted-foreground mt-2">Please wait while we complete the setup...</p>
      </div>
    </div>
  );
};

export default ConnectCallback;
