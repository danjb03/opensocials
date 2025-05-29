
declare global {
  interface Window {
    PhylloConnect: any;
  }
}

export const validatePhylloConnect = (phylloConnect: any): boolean => {
  if (!phylloConnect) {
    console.error('❌ PhylloConnect instance is undefined');
    return false;
  }

  const requiredMethods = ['on'];
  for (const method of requiredMethods) {
    if (typeof phylloConnect[method] !== 'function') {
      console.error(`❌ PhylloConnect instance missing required method: ${method}`);
      return false;
    }
  }

  return true;
};

export const waitForPhylloReady = async (maxAttempts = 10): Promise<boolean> => {
  for (let i = 0; i < maxAttempts; i++) {
    if (window.PhylloConnect && typeof window.PhylloConnect.initialize === 'function') {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  return false;
};
