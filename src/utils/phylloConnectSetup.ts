
import { validatePhylloConnect } from './phylloValidation';
import { createPhylloEventHandlers } from '@/components/creator/phyllo/PhylloEventHandlers';

interface PhylloConfig {
  userId: string;
  token: string;
}

export const createPhylloConfig = (userId: string, token: string) => ({
  clientDisplayName: "OpenSocials",
  environment: "staging",
  userId,
  token,
  mode: "redirect"
});

export const registerEventHandlers = (phylloConnect: any, eventHandlers: any) => {
  try {
    phylloConnect.on('accountConnected', function (accountId, workplatformId, userIdFromEvent) {
      console.log('🟢 Account Connected Event:', { accountId, workplatformId, userIdFromEvent });
      eventHandlers.handleAccountConnected(accountId, workplatformId, userIdFromEvent);
    });

    phylloConnect.on('accountDisconnected', function (accountId, workplatformId, userIdFromEvent) {
      console.log('🔴 Account Disconnected Event:', { accountId, workplatformId, userIdFromEvent });
      eventHandlers.handleAccountDisconnected(accountId, workplatformId, userIdFromEvent);
    });

    phylloConnect.on('tokenExpired', function (accountId) {
      console.log('⏰ Token Expired Event:', accountId);
      eventHandlers.handleTokenExpired(accountId);
    });

    phylloConnect.on('connectionFailure', function (reason, workplatformId, userIdFromEvent) {
      console.log('❌ Connection Failure Event:', { reason, workplatformId, userIdFromEvent });
      eventHandlers.handleConnectionFailure(reason, workplatformId, userIdFromEvent);
    });

    phylloConnect.on('error', function (reason) {
      console.log('🚨 Phyllo Error Event:', reason);
      eventHandlers.handleError(reason);
    });

    phylloConnect.on('exit', function (reason, workplatformId, userIdFromEvent) {
      console.log('🚪 Phyllo Exit Event:', { reason, workplatformId, userIdFromEvent });
      eventHandlers.handleExit(reason, workplatformId, userIdFromEvent);
    });

    console.log('✅ All event handlers registered successfully');
  } catch (error) {
    console.error('❌ Error registering event handlers:', error);
    throw new Error(`Failed to register event handlers: ${error.message}`);
  }
};

export const setupPhylloConnect = async (
  config: ReturnType<typeof createPhylloConfig>,
  userId: string,
  onConnectionSuccess?: () => void,
  setIsPhylloLoading?: (loading: boolean) => void
) => {
  console.log('📋 Phyllo config:', config);

  try {
    const phylloConnect = await window.PhylloConnect.initialize(config);
    console.log('✅ PhylloConnect initialization completed:', phylloConnect);

    if (!validatePhylloConnect(phylloConnect)) {
      throw new Error('Failed to initialize Phyllo Connect - invalid instance returned');
    }

    const eventHandlers = createPhylloEventHandlers(
      userId,
      onConnectionSuccess,
      setIsPhylloLoading
    );

    registerEventHandlers(phylloConnect, eventHandlers);

    return phylloConnect;
  } catch (initError) {
    console.error('❌ Phyllo initialization error:', initError);
    throw new Error(`Phyllo initialization failed: ${initError.message}`);
  }
};
