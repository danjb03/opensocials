
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

export const createPhylloEventHandlers = (
  userId: string,
  onConnectionSuccess?: () => void,
  setIsLoading?: (loading: boolean) => void
) => {
  const handleAccountConnected = async (accountId: string, workplatformId: string, userIdFromEvent: string) => {
    try {
      console.log('Facebook/Account Connected with parameters:', { accountId, workplatformId, userIdFromEvent });

      if (!accountId || !workplatformId || !userIdFromEvent) {
        console.error('Missing required parameters for account connection:', { accountId, workplatformId, userIdFromEvent });
        toast.error('Failed to connect: missing account information');
        setIsLoading?.(false);
        return;
      }

      console.log('Calling storeConnectedAccount function for platform:', workplatformId);
      
      const { data, error } = await supabase.functions.invoke('storeConnectedAccount', {
        body: {
          user_id: userId,
          platform: workplatformId,
          account_id: accountId,
          workplatform_id: workplatformId
        }
      });

      if (error) {
        console.error('Error storing connected account:', error);
        toast.error(`Connected to ${workplatformId} but failed to save connection. Please try again.`);
        setIsLoading?.(false);
        return;
      }

      console.log('Successfully stored connected account:', data);
      toast.success(`${workplatformId} account connected successfully!`);
      onConnectionSuccess?.();
      setIsLoading?.(false);
      
    } catch (error) {
      console.error('Error in handleAccountConnected:', error);
      toast.error(`Failed to connect ${workplatformId}: ${error.message}`);
      setIsLoading?.(false);
    }
  };

  const handleAccountDisconnected = (accountId: string, workplatformId: string, userIdFromEvent: string) => {
    try {
      console.log('Account Disconnected with parameters:', { accountId, workplatformId, userIdFromEvent });
      toast.success(`${workplatformId} account disconnected successfully`);
      onConnectionSuccess?.();
      setIsLoading?.(false);
    } catch (error) {
      console.error('Error in handleAccountDisconnected:', error);
      setIsLoading?.(false);
    }
  };

  const handleTokenExpired = (accountId: string) => {
    try {
      console.log('Token expired for account:', accountId);
      toast.error('Session expired. Please try connecting again.');
      setIsLoading?.(false);
    } catch (error) {
      console.error('Error in handleTokenExpired:', error);
      setIsLoading?.(false);
    }
  };

  const handleConnectionFailure = (reason: string, workplatformId: string, userIdFromEvent: string) => {
    try {
      console.log('Connection failure with parameters:', { reason, workplatformId, userIdFromEvent });
      
      // Add specific handling for Facebook failures
      if (workplatformId?.toLowerCase().includes('facebook') || workplatformId?.toLowerCase().includes('meta')) {
        console.log('Facebook connection failed:', reason);
        toast.error(`Failed to connect to Facebook: ${reason || 'Connection was cancelled or failed'}`);
      } else {
        toast.error(`Failed to connect to ${workplatformId || 'platform'}: ${reason || 'Unknown error'}`);
      }
      setIsLoading?.(false);
    } catch (error) {
      console.error('Error in handleConnectionFailure:', error);
      setIsLoading?.(false);
    }
  };

  const handleError = (reason: string) => {
    try {
      console.log('Phyllo Connect error:', reason);
      toast.error(`Failed to connect social account: ${reason || 'Unknown error'}`);
      setIsLoading?.(false);
    } catch (error) {
      console.error('Error in handleError:', error);
      setIsLoading?.(false);
    }
  };

  const handleExit = (reason: string, workplatformId: string, userIdFromEvent: string) => {
    try {
      console.warn('Phyllo exit triggered with reason:', reason, 'Work Platform:', workplatformId, 'User:', userIdFromEvent);
      
      // Only show toast if it's not a successful completion
      if (reason && reason !== 'completed' && reason !== 'success') {
        if (workplatformId?.toLowerCase().includes('facebook') || workplatformId?.toLowerCase().includes('meta')) {
          console.log('Facebook connection cancelled by user');
          toast.info('Facebook connection was cancelled');
        } else {
          toast.info(`Connection to ${workplatformId || 'platform'} was cancelled`);
        }
      }
      setIsLoading?.(false);
    } catch (error) {
      console.error('Error in handleExit:', error);
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
