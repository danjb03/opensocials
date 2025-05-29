
import { storeRedirectData } from './phylloRedirectData';

export const createPhylloRedirectUrl = (token: string, userId: string): string => {
  const returnUrl = `${window.location.origin}/creator/connect/callback`;
  
  const phylloParams = new URLSearchParams({
    clientDisplayName: 'OpenSocials',
    userId: userId,
    token: token,
    environment: 'staging',
    flow: 'redirect',
    redirectUrl: returnUrl
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
  console.log('🔑 Generating fresh Phyllo token via edge function...');
  
  // Use the Supabase edge function approach
  const response = await fetch('/functions/v1/generatePhylloToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      user_id: userId,
      user_name: userEmail?.split('@')[0] || 'User'
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to generate Phyllo token: ${response.statusText}`);
  }

  const { token: freshToken } = await response.json();
  
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
