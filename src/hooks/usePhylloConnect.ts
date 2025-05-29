
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

      console.log('Phyllo Connect initialized, registering callbacks...');

      const eventHandlers = createPhylloEventHandlers(
        userId,
        onConnectionSuccess,
        setIsPhylloLoading
      );

      // Register callbacks with correct parameter counts
      phylloConnect.on('accountConnected', function (accountId, workplatformId, userIdFromEvent) {
        console.log('Account Connected:', { accountId, workplatformId, userIdFromEvent });
        eventHandlers.handleAccountConnected(accountId, workplatformId, userIdFromEvent);
      });

      phylloConnect.on('accountDisconnected', function (accountId, workplatformId, userIdFromEvent) {
        console.log('Account Disconnected:', { accountId, workplatformId, userIdFromEvent });
        eventHandlers.handleAccountDisconnected(accountId, workplatformId, userIdFromEvent);
      });

      phylloConnect.on('error', function (reason) {
        console.log('Phyllo Connect error:', reason);
        eventHandlers.handleError(reason);
      });

      // Register exit callback with 0 parameters (based on successful test)
      phylloConnect.on('exit', function () {
        console.log('Phyllo exit triggered');
        eventHandlers.handleExit("user_exit", userId);
      });

      phylloConnect.on('tokenExpired', function (accountId) {
        console.log('Token expired for account:', accountId);
        eventHandlers.handleTokenExpired(accountId);
      });

      phylloConnect.on('connectionFailure', function (reason, userIdFromEvent) {
        console.log('Connection failure:', { reason, userIdFromEvent });
        eventHandlers.handleConnectionFailure(reason, userIdFromEvent);
      });

      console.log('All callbacks registered successfully. Opening Phyllo Connect...');
      phylloConnect.open();
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
