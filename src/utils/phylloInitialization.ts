
import { generatePhylloToken } from './phylloToken';
import { storeRedirectData } from './phylloRedirectData';

export const createPhylloRedirectUrl = (token: string, userId: string): string => {
  const returnUrl = `${window.location.origin}/creator/connect/callback`;
  
  const phylloParams = new URLSearchParams({
    client_display_name: 'OpenSocials',
    user_token: token,
    user_id: userId,
    env: 'staging',
    redirect_url: returnUrl
  });
  
  const baseUrl = 'https://connect.getphyllo.com';
  const phylloUrl = `${baseUrl}?${phylloParams.toString()}`;
  
  console.log('🌐 Phyllo Connect URL:', phylloUrl);
  console.log('🔙 Return URL:', returnUrl);
  
  return phylloUrl;
};

export const initializePhylloRedirect = async (
  userId: string,
  userEmail: string | undefined
): Promise<void> => {
  console.log('🚀 Starting Phyllo Connect initialization...');
  console.log('🔑 Generating fresh Phyllo token...');
  
  const freshToken = await generatePhylloToken(userId, userEmail);
  
  if (!freshToken) {
    throw new Error('Failed to generate Phyllo token');
  }

  // Store data for redirect return
  storeRedirectData(userId, userEmail, freshToken);
  
  console.log('🔄 Redirecting to Phyllo Connect URL...');
  
  const phylloUrl = createPhylloRedirectUrl(freshToken, userId);
  
  // Add a small delay to ensure localStorage is saved
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Redirect to Phyllo Connect
  window.location.href = phylloUrl;
};
