
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

export const createPhylloEventHandlers = (
  userId: string,
  onConnectionSuccess?: () => void,
  setIsLoading?: (loading: boolean) => void
) => {
  const handleAccountConnected = (accountId: string, workplatformId: string, userIdFromEvent: string) => {
    console.log('Account Connected with parameters:', { accountId, workplatformId, userIdFromEvent });

    if (accountId && workplatformId && userIdFromEvent) {
      console.log('Calling storeConnectedAccount function...');
      
      supabase.functions.invoke('storeConnectedAccount', {
        body: {
          user_id: userId,
          platform: workplatformId,
          account_id: accountId,
          workplatform_id: workplatformId
        }
      }).then(({ data, error }) => {
        if (error) {
          console.error('Error storing connected account:', error);
          toast.error('Connected to platform but failed to save connection. Please try again.');
        } else {
          console.log('Successfully stored connected account:', data);
          toast.success('Social account connected successfully!');
          onConnectionSuccess?.();
        }
      }).catch(error => {
        console.error('Error storing connected account:', error);
        toast.error('Connected to platform but failed to save connection. Please try again.');
      });
    } else {
      console.error('Missing required parameters for account connection:', { accountId, workplatformId, userIdFromEvent });
      toast.error('Failed to connect: missing account information');
    }
  };

  const handleAccountDisconnected = (accountId: string, workplatformId: string, userIdFromEvent: string) => {
    console.log('Account Disconnected with parameters:', { accountId, workplatformId, userIdFromEvent });
    toast.success('Social account disconnected successfully');
    onConnectionSuccess?.();
  };

  const handleTokenExpired = (accountId: string) => {
    console.log('Token expired for account:', accountId);
    toast.error('Session expired. Please try connecting again.');
    setIsLoading?.(false);
  };

  // Updated to accept three parameters as per SDK requirements
  const handleConnectionFailure = (reason: string, workplatformId: string, userId: string) => {
    console.log('Connection failure:', { reason, workplatformId, userId });
    toast.error(`Failed to connect: ${reason || 'Unknown error'}`);
    setIsLoading?.(false);
  };

  const handleError = (reason: string) => {
    console.log('Phyllo Connect error:', reason);
    toast.error(`Failed to connect social account: ${reason || 'Unknown error'}`);
    setIsLoading?.(false);
  };

  // Updated to accept 0 parameters to match the callback registration
  const handleExit = () => {
    console.warn('Phyllo exit triggered');
    setIsLoading?.(false);
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
