import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { usePhylloScript } from './usePhylloScript';
import { generatePhylloToken } from '@/utils/phylloToken';
import { createPhylloEventHandlers } from '@/components/creator/phyllo/PhylloEventHandlers';

declare global {
  interface Window {
    PhylloConnect: any;
  }
}

interface PhylloRedirectData {
  userId: string;
  userEmail?: string;
  token: string;
  timestamp: number;
}

export const usePhylloConnect = (
  userId: string | undefined,
  userEmail: string | undefined,
  onConnectionSuccess?: () => void
) => {
  const [isPhylloLoading, setIsPhylloLoading] = useState(false);
  const { phylloScriptLoaded, loadPhylloScript } = usePhylloScript();

  // Check for redirect return on component mount
  useEffect(() => {
    const checkForRedirectReturn = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const phylloReturn = urlParams.get('phyllo_return');
      
      if (phylloReturn === 'true' && userId) {
        console.log('Detected return from Phyllo redirect');
        
        // Get stored data from localStorage
        const storedData = localStorage.getItem('phyllo_redirect_data');
        if (storedData) {
          try {
            const redirectData: PhylloRedirectData = JSON.parse(storedData);
            
            // Verify the stored userId matches current user and token is not expired
            if (redirectData.userId === userId) {
              const isTokenExpired = Date.now() - redirectData.timestamp > 3600000; // 1 hour
              if (!isTokenExpired) {
                console.log('Resuming Phyllo Connect session after redirect');
                setIsPhylloLoading(true);
                
                // Clean up URL and localStorage
                window.history.replaceState({}, '', window.location.pathname);
                localStorage.removeItem('phyllo_redirect_data');
                
                // Resume Phyllo Connect
                await resumePhylloConnect(redirectData);
              } else {
                console.warn('Stored token has expired');
                localStorage.removeItem('phyllo_redirect_data');
                toast.error('Session expired. Please try connecting again.');
              }
            } else {
              console.warn('Stored userId does not match current user');
              localStorage.removeItem('phyllo_redirect_data');
            }
          } catch (error) {
            console.error('Error parsing stored Phyllo data:', error);
            localStorage.removeItem('phyllo_redirect_data');
            toast.error('Failed to restore session. Please try connecting again.');
          }
        }
      }
    };

    if (userId) {
      checkForRedirectReturn();
    }
  }, [userId]);

  const validatePhylloConnect = (phylloConnect: any): boolean => {
    if (!phylloConnect) {
      console.error('PhylloConnect instance is undefined');
      return false;
    }

    const requiredMethods = ['on', 'open'];
    for (const method of requiredMethods) {
      if (typeof phylloConnect[method] !== 'function') {
        console.error(`PhylloConnect instance missing required method: ${method}`);
        return false;
      }
    }

    return true;
  };

  const waitForPhylloReady = async (maxAttempts = 10): Promise<boolean> => {
    for (let i = 0; i < maxAttempts; i++) {
      if (window.PhylloConnect && typeof window.PhylloConnect.initialize === 'function') {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    return false;
  };

  const resumePhylloConnect = async (redirectData: PhylloRedirectData) => {
    try {
      console.log('Loading Phyllo script for resume...');
      await loadPhylloScript();
      
      const isReady = await waitForPhylloReady();
      if (!isReady) {
        throw new Error('Phyllo Connect library failed to load properly');
      }

      console.log('Resuming Phyllo Connect with stored token');
      
      const config = {
        clientDisplayName: "OpenSocials",
        environment: "staging",
        userId: redirectData.userId,
        token: redirectData.token,
        redirect: true,
        redirectURL: `${window.location.origin}/creator?phyllo_return=true`
      };

      console.log('Phyllo config for resume:', config);

      try {
        const phylloConnect = await window.PhylloConnect.initialize(config);
        console.log('PhylloConnect initialization completed for resume:', phylloConnect);

        if (!validatePhylloConnect(phylloConnect)) {
          throw new Error('Failed to initialize Phyllo Connect - invalid instance returned');
        }

        const eventHandlers = createPhylloEventHandlers(
          redirectData.userId,
          onConnectionSuccess,
          setIsPhylloLoading
        );

        // Register all event handlers
        registerEventHandlers(phylloConnect, eventHandlers);

        console.log('Phyllo Connect resumed successfully');
        setIsPhylloLoading(false);
      } catch (initError) {
        console.error('Phyllo resume initialization error:', initError);
        throw new Error(`Phyllo resume initialization failed: ${initError.message}`);
      }
      
    } catch (error) {
      console.error('Error resuming Phyllo Connect:', error);
      toast.error(`Failed to resume social account connection: ${error.message}`);
      setIsPhylloLoading(false);
    }
  };

  const registerEventHandlers = (phylloConnect: any, eventHandlers: any) => {
    try {
      phylloConnect.on('accountConnected', function (accountId, workplatformId, userIdFromEvent) {
        console.log('Account Connected:', { accountId, workplatformId, userIdFromEvent });
        eventHandlers.handleAccountConnected(accountId, workplatformId, userIdFromEvent);
      });

      phylloConnect.on('accountDisconnected', function (accountId, workplatformId, userIdFromEvent) {
        console.log('Account Disconnected:', { accountId, workplatformId, userIdFromEvent });
        eventHandlers.handleAccountDisconnected(accountId, workplatformId, userIdFromEvent);
      });

      phylloConnect.on('tokenExpired', function (accountId) {
        console.log('Token expired for account:', accountId);
        eventHandlers.handleTokenExpired(accountId);
      });

      phylloConnect.on('connectionFailure', function (reason, workplatformId, userIdFromEvent) {
        console.log('Connection failure:', { reason, workplatformId, userIdFromEvent });
        eventHandlers.handleConnectionFailure(reason, workplatformId, userIdFromEvent);
      });

      phylloConnect.on('error', function (reason) {
        console.log('Phyllo Connect error:', reason);
        eventHandlers.handleError(reason);
      });

      phylloConnect.on('exit', function (reason, workplatformId, userIdFromEvent) {
        console.log('Phyllo exit triggered:', { reason, workplatformId, userIdFromEvent });
        eventHandlers.handleExit(reason, workplatformId, userIdFromEvent);
      });

      console.log('All event handlers registered successfully');
    } catch (error) {
      console.error('Error registering event handlers:', error);
      throw new Error(`Failed to register event handlers: ${error.message}`);
    }
  };

  const initializePhylloConnect = async () => {
    if (!userId) {
      toast.error('Please log in to connect your social accounts');
      return;
    }

    setIsPhylloLoading(true);
    
    try {
      console.log('Loading Phyllo script...');
      await loadPhylloScript();
      
      const isReady = await waitForPhylloReady();
      if (!isReady) {
        throw new Error('Phyllo Connect library failed to load properly');
      }

      console.log('Generating fresh Phyllo token...');
      const freshToken = await generatePhylloToken(userId, userEmail);
      
      if (!freshToken) {
        throw new Error('Failed to generate Phyllo token');
      }

      // Store data for redirect return
      const redirectData: PhylloRedirectData = {
        userId,
        userEmail,
        token: freshToken,
        timestamp: Date.now()
      };
      
      localStorage.setItem('phyllo_redirect_data', JSON.stringify(redirectData));
      
      console.log('Initializing Phyllo Connect for user:', userId);
      
      const config = {
        clientDisplayName: "OpenSocials",
        environment: "staging",
        userId: userId,
        token: freshToken,
        redirect: true,
        redirectURL: `${window.location.origin}/creator?phyllo_return=true`
      };

      console.log('Phyllo config for initialization:', config);

      try {
        const phylloConnect = await window.PhylloConnect.initialize(config);
        console.log('PhylloConnect initialization completed:', phylloConnect);

        if (!validatePhylloConnect(phylloConnect)) {
          throw new Error('Failed to initialize Phyllo Connect - invalid instance returned');
        }

        console.log('Phyllo Connect initialized, registering callbacks...');

        const eventHandlers = createPhylloEventHandlers(
          userId,
          onConnectionSuccess,
          setIsPhylloLoading
        );

        // Register all event handlers
        registerEventHandlers(phylloConnect, eventHandlers);

        console.log('Opening Phyllo Connect for social platform selection...');
        
        try {
          phylloConnect.open();
        } catch (openError) {
          console.error('Error opening Phyllo Connect:', openError);
          throw new Error(`Failed to open social account connection: ${openError.message}`);
        }
      } catch (initError) {
        console.error('Phyllo initialization error details:', initError);
        throw new Error(`Phyllo initialization failed: ${initError.message}`);
      }
      
    } catch (error) {
      console.error('Error initializing Phyllo Connect:', error);
      toast.error(`Failed to load social account connection: ${error.message}`);
      setIsPhylloLoading(false);
      localStorage.removeItem('phyllo_redirect_data');
    }
  };

  return {
    isPhylloLoading,
    phylloScriptLoaded,
    initializePhylloConnect
  };
};
