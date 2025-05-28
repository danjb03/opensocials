
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
      
      // Wait longer for the script to fully initialize
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!window.PhylloConnect) {
        throw new Error('Phyllo Connect library not available');
      }

      console.log('PhylloConnect object:', window.PhylloConnect);
      
      console.log('Generating fresh Phyllo token...');
      const freshToken = await generatePhylloToken(userId, userEmail);
      
      console.log('Initializing Phyllo Connect for user:', userId);
      
      const phylloConnect = window.PhylloConnect.initialize({
        clientDisplayName: "OpenSocials",
        environment: "staging",
        userId: userId,
        token: freshToken
      });

      console.log('Phyllo Connect initialized:', phylloConnect);

      const eventHandlers = createPhylloEventHandlers(
        userId,
        onConnectionSuccess,
        setIsLoading
      );

      // Add debugging for event handler registration
      console.log('Registering event handlers...');
      
      try {
        phylloConnect.on('accountConnected', eventHandlers.handleAccountConnected);
        console.log('✓ accountConnected handler registered');
      } catch (e) {
        console.error('✗ Error registering accountConnected handler:', e);
      }

      try {
        phylloConnect.on('accountDisconnected', eventHandlers.handleAccountDisconnected);
        console.log('✓ accountDisconnected handler registered');
      } catch (e) {
        console.error('✗ Error registering accountDisconnected handler:', e);
      }

      try {
        phylloConnect.on('tokenExpired', eventHandlers.handleTokenExpired);
        console.log('✓ tokenExpired handler registered');
      } catch (e) {
        console.error('✗ Error registering tokenExpired handler:', e);
      }

      try {
        phylloConnect.on('connectionFailure', eventHandlers.handleConnectionFailure);
        console.log('✓ connectionFailure handler registered');
      } catch (e) {
        console.error('✗ Error registering connectionFailure handler:', e);
      }

      try {
        phylloConnect.on('error', eventHandlers.handleError);
        console.log('✓ error handler registered');
      } catch (e) {
        console.error('✗ Error registering error handler:', e);
      }

      try {
        phylloConnect.on('exit', eventHandlers.handleExit);
        console.log('✓ exit handler registered successfully');
      } catch (e) {
        console.error('✗ Error registering exit handler:', e);
        console.error('Exit handler function:', eventHandlers.handleExit);
        console.error('Exit handler toString:', eventHandlers.handleExit.toString());
      }

      console.log('Opening Phyllo Connect...');
      phylloConnect.open();
    } catch (error) {
      console.error('Error initializing Phyllo Connect:', error);
      toast.error(`Failed to load social account connection: ${error.message}`);
      setIsLoading?.(false);
    }
  };

  return {
    isPhylloLoading,
    phylloScriptLoaded,
    initializePhylloConnect
  };
};
