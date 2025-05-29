
interface PhylloRedirectData {
  userId: string;
  userEmail?: string;
  token: string;
  platform: string;
  timestamp: number;
}

export const storeRedirectData = (
  userId: string,
  userEmail: string | undefined,
  token: string,
  platform: string
): void => {
  const redirectData: PhylloRedirectData = {
    userId,
    userEmail,
    token,
    platform,
    timestamp: Date.now()
  };
  
  localStorage.setItem('phyllo_redirect_data', JSON.stringify(redirectData));
};

export const getRedirectData = (): PhylloRedirectData | null => {
  const storedData = localStorage.getItem('phyllo_redirect_data');
  if (!storedData) return null;
  
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error('❌ Error parsing stored Phyllo data:', error);
    return null;
  }
};

export const clearRedirectData = (): void => {
  localStorage.removeItem('phyllo_redirect_data');
};

export const validateRedirectData = (redirectData: PhylloRedirectData, currentUserId: string): boolean => {
  if (redirectData.userId !== currentUserId) {
    console.warn('⚠️ Stored userId does not match current user');
    return false;
  }

  const isTokenExpired = Date.now() - redirectData.timestamp > 3600000; // 1 hour
  if (isTokenExpired) {
    console.warn('⚠️ Stored token has expired');
    return false;
  }

  return true;
};
