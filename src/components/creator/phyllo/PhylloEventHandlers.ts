
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

export const createPhylloEventHandlers = (
  userId: string,
  onConnectionSuccess?: () => void,
  setIsLoading?: (loading: boolean) => void
) => {
  const handleAccountConnected = (...args: any[]) => {
    console.log('Account Connected with args:', args);
    const [accountId, workplatformId, userIdFromEvent] = args;

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
    }
  };

  const handleAccountDisconnected = (...args: any[]) => {
    console.log('Account Disconnected with args:', args);
    toast.success('Social account disconnected successfully');
    onConnectionSuccess?.();
  };

  const handleTokenExpired = (...args: any[]) => {
    console.log('Token expired with args:', args);
    toast.error('Session expired. Please try connecting again.');
    setIsLoading?.(false);
  };

  const handleConnectionFailure = (...args: any[]) => {
    console.log('Connection failure with args:', args);
    const [reason, workplatformId] = args;
    toast.error(`Failed to connect to ${workplatformId || 'platform'}: ${reason || 'Unknown error'}`);
    setIsLoading?.(false);
  };

  const handleError = (...args: any[]) => {
    console.log('Phyllo Connect error with args:', args);
    const [reason] = args;
    toast.error(`Failed to connect social account: ${reason || 'Unknown error'}`);
    setIsLoading?.(false);
  };

  const handleExit = (...args: any[]) => {
    console.log('Phyllo Connect exit with args:', args);
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
