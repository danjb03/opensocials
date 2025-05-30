
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

export const createPhylloEventHandlers = (
  userId: string,
  onConnectionSuccess?: () => void,
  setIsLoading?: (loading: boolean) => void
) => {
  const handleAccountConnected = async (accountId: string, workplatformId: string, userIdFromEvent: string) => {
    try {

      if (!accountId || !workplatformId || !userIdFromEvent) {
        console.error('❌ Missing required parameters for account connection:', { accountId, workplatformId, userIdFromEvent });
        toast.error('Failed to connect: missing account information');
        setIsLoading?.(false);
        return;
      }

      
      const { data, error } = await supabase.functions.invoke('storeConnectedAccount', {
        body: {
          user_id: userId,
          platform: workplatformId,
          account_id: accountId,
          workplatform_id: workplatformId
        }
      });

      if (error) {
        console.error('❌ Error storing connected account:', error);
        toast.error(`Connected to ${workplatformId} but failed to save connection. Please try again.`);
        setIsLoading?.(false);
        return;
      }

      toast.success(`${workplatformId} account connected successfully!`);
      onConnectionSuccess?.();
      setIsLoading?.(false);
      
    } catch (error) {
      console.error('💥 Error in handleAccountConnected:', error);
      toast.error(`Failed to connect ${workplatformId}: ${error.message}`);
      setIsLoading?.(false);
    }
  };

  const handleAccountDisconnected = (accountId: string, workplatformId: string, userIdFromEvent: string) => {
    try {
      toast.success(`${workplatformId} account disconnected successfully`);
      onConnectionSuccess?.();
      setIsLoading?.(false);
    } catch (error) {
      console.error('💥 Error in handleAccountDisconnected:', error);
      setIsLoading?.(false);
    }
  };

  const handleTokenExpired = (accountId: string) => {
    try {
      toast.error('Session expired. Please try connecting again.');
      setIsLoading?.(false);
    } catch (error) {
      console.error('💥 Error in handleTokenExpired:', error);
      setIsLoading?.(false);
    }
  };

  const handleConnectionFailure = (reason: string, workplatformId: string, userIdFromEvent: string) => {
    try {
      
      // Handle specific connection failure reasons
      let errorMessage = '';
      
      if (reason?.toLowerCase().includes('refused') || reason?.toLowerCase().includes('x-frame-options')) {
        errorMessage = `${workplatformId || 'Platform'} blocked the connection. This is a known issue with some social platforms. Please try again or contact support.`;
      } else if (reason?.toLowerCase().includes('popup')) {
        errorMessage = `Popup was blocked. Please allow popups for this site and try again.`;
      } else if (reason?.toLowerCase().includes('timeout')) {
        errorMessage = `Connection timed out. Please check your internet connection and try again.`;
      } else if (reason?.toLowerCase().includes('cancel')) {
        errorMessage = `Connection was cancelled. You can try again when ready.`;
      } else {
        errorMessage = `Failed to connect to ${workplatformId || 'platform'}: ${reason || 'Unknown error'}`;
      }
      
      toast.error(errorMessage);
      setIsLoading?.(false);
    } catch (error) {
      console.error('💥 Error in handleConnectionFailure:', error);
      setIsLoading?.(false);
    }
  };

  const handleError = (reason: string) => {
    try {
      
      let errorMessage = '';
      
      if (reason?.toLowerCase().includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (reason?.toLowerCase().includes('invalid')) {
        errorMessage = 'Invalid configuration. Please contact support.';
      } else {
        errorMessage = `Failed to connect social account: ${reason || 'Unknown error'}`;
      }
      
      toast.error(errorMessage);
      setIsLoading?.(false);
    } catch (error) {
      console.error('💥 Error in handleError:', error);
      setIsLoading?.(false);
    }
  };

  const handleExit = (reason: string, workplatformId: string, userIdFromEvent: string) => {
    try {
      
      // Only show toast if it's not a successful completion
      if (reason && reason !== 'completed' && reason !== 'success') {
        if (reason.toLowerCase().includes('cancel') || reason.toLowerCase().includes('close')) {
          toast.info(`Connection to ${workplatformId || 'platform'} was cancelled`);
        } else if (reason.toLowerCase().includes('error')) {
          toast.error(`Connection failed: ${reason}`);
        } else {
          // Silent exit
        }
      }
      setIsLoading?.(false);
    } catch (error) {
      console.error('💥 Error in handleExit:', error);
      setIsLoading?.(false);
    }
  };

  return {
    handleAccountConnected,
    handleAccountDisconnected,
    handleTokenExpired,
    handleConnectionFailure,
    handleError,
    handleExit
  };
};
