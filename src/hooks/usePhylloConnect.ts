
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { usePhylloScript } from './usePhylloScript';
import { initializePhylloRedirect } from '@/utils/phylloInitialization';
import { 
  getRedirectData, 
  clearRedirectData, 
  validateRedirectData 
} from '@/utils/phylloRedirectData';
import { waitForPhylloReady } from '@/utils/phylloValidation';
import { createPhylloConfig, setupPhylloConnect } from '@/utils/phylloConnectSetup';

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
        console.log('🔄 Detected return from Phyllo redirect');
        
        const redirectData = getRedirectData();
        if (redirectData && validateRedirectData(redirectData, userId)) {
          console.log('✅ Resuming Phyllo Connect session after redirect');
          setIsPhylloLoading(true);
          
          // Clean up URL and localStorage
          window.history.replaceState({}, '', window.location.pathname);
          clearRedirectData();
          
          // Resume Phyllo Connect
          await resumePhylloConnect(redirectData);
        } else {
          clearRedirectData();
          if (!redirectData) {
            toast.error('Session data not found. Please try connecting again.');
          } else {
            toast.error('Session expired. Please try connecting again.');
          }
        }
      }
    };

    if (userId) {
      checkForRedirectReturn();
    }
  }, [userId]);

  const resumePhylloConnect = async (redirectData: any) => {
    try {
      console.log('📜 Loading Phyllo script for resume...');
      await loadPhylloScript();
      
      const isReady = await waitForPhylloReady();
      if (!isReady) {
        throw new Error('Phyllo Connect library failed to load properly');
      }

      console.log('🔄 Resuming Phyllo Connect with stored token');
      
      const config = createPhylloConfig(redirectData.userId, redirectData.token);
      await setupPhylloConnect(config, redirectData.userId, onConnectionSuccess, setIsPhylloLoading);

      console.log('✅ Phyllo Connect resumed successfully');
      setIsPhylloLoading(false);
    } catch (error) {
      console.error('💥 Error resuming Phyllo Connect:', error);
      toast.error(`Failed to resume social account connection: ${error.message}`);
      setIsPhylloLoading(false);
    }
  };

  const initializePhylloConnect = async () => {
    if (!userId) {
      toast.error('Please log in to connect your social accounts');
      return;
    }

    setIsPhylloLoading(true);
    
    try {
      await initializePhylloRedirect(userId, userEmail);
    } catch (error) {
      console.error('💥 Error initializing Phyllo Connect:', error);
      toast.error(`Failed to load social account connection: ${error.message}`);
      setIsPhylloLoading(false);
      clearRedirectData();
    }
  };

  return {
    isPhylloLoading,
    phylloScriptLoaded,
    initializePhylloConnect
  };
};
