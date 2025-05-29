
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
            
            // Verify the stored userId matches current user
            if (redirectData.userId === userId) {
              console.log('Resuming Phyllo Connect session after redirect');
              setIsPhylloLoading(true);
              
              // Clean up URL and localStorage
              window.history.replaceState({}, '', window.location.pathname);
              localStorage.removeItem('phyllo_redirect_data');
              
              // Resume Phyllo Connect
              await resumePhylloConnect(redirectData);
            } else {
              console.warn('Stored userId does not match current user');
              localStorage.removeItem('phyllo_redirect_data');
            }
          } catch (error) {
            console.error('Error parsing stored Phyllo data:', error);
            localStorage.removeItem('phyllo_redirect_data');
          }
        }
      }
    };

    if (userId) {
      checkForRedirectReturn();
    }
  }, [userId]);

  const resumePhylloConnect = async (redirectData: PhylloRedirectData) => {
    try {
      await loadPhylloScript();
      
      if (!window.PhylloConnect) {
        throw new Error('Phyllo Connect library not available');
      }

      console.log('Resuming Phyllo Connect with stored token');
      
      const phylloConnect = window.PhylloConnect.initialize({
        clientDisplayName: "OpenSocials",
        environment: "staging",
        userId: redirectData.userId,
        token: redirectData.token,
        flow: 'redirect',
        redirectURL: `${window.location.origin}/creator/profile?phyllo_return=true`
      });

      const eventHandlers = createPhylloEventHandlers(
        redirectData.userId,
        onConnectionSuccess,
        setIsPhylloLoading
      );

      // Register all event handlers
      registerEventHandlers(phylloConnect, eventHandlers);

      console.log('Phyllo Connect resumed successfully');
      setIsPhylloLoading(false);
      
    } catch (error) {
      console.error('Error resuming Phyllo Connect:', error);
      toast.error(`Failed to resume social account connection: ${error.message}`);
      setIsPhylloLoading(false);
    }
  };

  const registerEventHandlers = (phylloConnect: any, eventHandlers: any) => {
    phylloConnect.on('accountConnected', function (accountId: string, workplatformId: string, userIdFromEvent: string) {
      console.log('Account Connected:', { accountId, workplatformId, userIdFromEvent });
      eventHandlers.handleAccountConnected(accountId, workplatformId, userIdFromEvent);
    });

    phylloConnect.on('accountDisconnected', function (accountId: string, workplatformId: string, userIdFromEvent: string) {
      console.log('Account Disconnected:', { accountId, workplatformId, userIdFromEvent });
      eventHandlers.handleAccountDisconnected(accountId, workplatformId, userIdFromEvent);
    });

    phylloConnect.on('tokenExpired', function (accountId: string) {
      console.log('Token expired for account:', accountId);
      eventHandlers.handleTokenExpired(accountId);
    });

    phylloConnect.on('connectionFailure', function (reason: string, workplatformId: string, userIdFromEvent: string) {
      console.log('Connection failure:', { reason, workplatformId, userIdFromEvent });
      eventHandlers.handleConnectionFailure(reason, workplatformId, userIdFromEvent);
    });

    phylloConnect.on('error', function (reason: string) {
      console.log('Phyllo Connect error:', reason);
      eventHandlers.handleError(reason);
    });

    phylloConnect.on('exit', function (reason: string, workplatformId: string, userIdFromEvent: string) {
      console.log('Phyllo exit triggered:', { reason, workplatformId, userIdFromEvent });
      eventHandlers.handleExit(reason, workplatformId, userIdFromEvent);
    });
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
      
      // Wait for the script to fully initialize
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!window.PhylloConnect) {
        throw new Error('Phyllo Connect library not available');
      }

      console.log('Generating fresh Phyllo token...');
      const freshToken = await generatePhylloToken(userId, userEmail);
      
      // Store data for redirect return
      const redirectData: PhylloRedirectData = {
        userId,
        userEmail,
        token: freshToken,
        timestamp: Date.now()
      };
      
      localStorage.setItem('phyllo_redirect_data', JSON.stringify(redirectData));
      
      console.log('Initializing Phyllo Connect for user:', userId);
      
      const phylloConnect = window.PhylloConnect.initialize({
        clientDisplayName: "OpenSocials",
        environment: "staging",
        userId: userId,
        token: freshToken,
        flow: 'redirect',
        redirectURL: `${window.location.origin}/creator/profile?phyllo_return=true`
      });

      console.log('Phyllo Connect initialized, registering callbacks...');

      const eventHandlers = createPhylloEventHandlers(
        userId,
        onConnectionSuccess,
        setIsPhylloLoading
      );

      // Register all event handlers
      registerEventHandlers(phylloConnect, eventHandlers);

      console.log('All callbacks registered successfully. Opening Phyllo Connect...');
      
      // For redirect flow, open immediately
      try {
        phylloConnect.open();
      } catch (openError) {
        console.error('Error opening Phyllo Connect:', openError);
        toast.error(`Failed to open social account connection: ${openError.message}`);
        setIsPhylloLoading(false);
        localStorage.removeItem('phyllo_redirect_data');
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
