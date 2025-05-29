
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import { usePhylloScript } from './usePhylloScript';
import { generatePhylloToken } from '@/utils/phylloToken';
import { createPhylloEventHandlers } from '@/components/creator/phyllo/PhylloEventHandlers';

declare global {
  interface Window {
    PhylloConnect: any;
  }
}

export const usePhylloConnect = (
  userId: string | undefined,
  userEmail: string | undefined,
  onConnectionSuccess?: () => void
) => {
  const [isPhylloLoading, setIsPhylloLoading] = useState(false);
  const { phylloScriptLoaded, loadPhylloScript } = usePhylloScript();

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
      
      console.log('Initializing Phyllo Connect for user:', userId);
      
      const phylloConnect = window.PhylloConnect.initialize({
        clientDisplayName: "OpenSocials",
        environment: "staging",
        userId: userId,
        token: freshToken
      });

      console.log('Phyllo Connect initialized, testing callbacks systematically...');

      const eventHandlers = createPhylloEventHandlers(
        userId,
        onConnectionSuccess,
        setIsPhylloLoading
      );

      // Start with minimal essential callbacks and add them one by one
      try {
        console.log('Registering accountConnected...');
        phylloConnect.on('accountConnected', function (accountId, workplatformId, userIdFromEvent) {
          console.log('Account Connected:', { accountId, workplatformId, userIdFromEvent });
          eventHandlers.handleAccountConnected(accountId, workplatformId, userIdFromEvent);
        });

        console.log('Registering accountDisconnected...');
        phylloConnect.on('accountDisconnected', function (accountId, workplatformId, userIdFromEvent) {
          console.log('Account Disconnected:', { accountId, workplatformId, userIdFromEvent });
          eventHandlers.handleAccountDisconnected(accountId, workplatformId, userIdFromEvent);
        });

        console.log('Registering error...');
        phylloConnect.on('error', function (reason) {
          console.log('Phyllo Connect error:', reason);
          eventHandlers.handleError(reason);
        });

        // Test different parameter counts for exit callback
        console.log('Testing exit callback with 0 parameters...');
        try {
          phylloConnect.on('exit', function () {
            console.warn("Phyllo exit triggered (0 params)");
            eventHandlers.handleExit("user_exit", userId);
          });
          console.log('Exit with 0 parameters - SUCCESS');
        } catch (e) {
          console.log('Exit with 0 parameters - FAILED:', e.message);
          
          console.log('Testing exit callback with 1 parameter...');
          try {
            phylloConnect.on('exit', function (reason) {
              console.warn("Phyllo exit triggered with reason:", reason);
              eventHandlers.handleExit(reason, userId);
            });
            console.log('Exit with 1 parameter - SUCCESS');
          } catch (e2) {
            console.log('Exit with 1 parameter - FAILED:', e2.message);
            
            console.log('Testing exit callback with 3 parameters...');
            try {
              phylloConnect.on('exit', function (reason, userIdFromEvent, metadata) {
                console.warn("Phyllo exit triggered:", { reason, userIdFromEvent, metadata });
                eventHandlers.handleExit(reason, userIdFromEvent);
              });
              console.log('Exit with 3 parameters - SUCCESS');
            } catch (e3) {
              console.log('Exit with 3 parameters - FAILED:', e3.message);
              throw new Error(`All exit parameter combinations failed: ${e.message}, ${e2.message}, ${e3.message}`);
            }
          }
        }

        console.log('Testing tokenExpired...');
        phylloConnect.on('tokenExpired', function (accountId) {
          console.log('Token expired for account:', accountId);
          eventHandlers.handleTokenExpired(accountId);
        });

        console.log('Testing connectionFailure...');
        phylloConnect.on('connectionFailure', function (reason, userIdFromEvent) {
          console.log('Connection failure:', { reason, userIdFromEvent });
          eventHandlers.handleConnectionFailure(reason, userIdFromEvent);
        });

        console.log('All callbacks registered successfully. Opening Phyllo Connect...');
        phylloConnect.open();
      } catch (callbackError) {
        console.error('Callback registration failed:', callbackError);
        throw callbackError;
      }
    } catch (error) {
      console.error('Error initializing Phyllo Connect:', error);
      toast.error(`Failed to load social account connection: ${error.message}`);
      setIsPhylloLoading(false);
    }
  };

  return {
    isPhylloLoading,
    phylloScriptLoaded,
    initializePhylloConnect
  };
};
