
import { useState } from 'react';

export const usePhylloScript = () => {
  const [phylloScriptLoaded, setPhylloScriptLoaded] = useState(false);

  const loadPhylloScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (phylloScriptLoaded || window.PhylloConnect) {
        resolve();
        return;
      }

      // Check if script already exists
      const existingScript = document.querySelector('script[src*="phyllo-connect"]');
      if (existingScript) {
        setPhylloScriptLoaded(true);
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.getphyllo.com/connect/v2/phyllo-connect.js';
      script.async = true;
      script.onload = () => {
        console.log('Phyllo script loaded successfully');
        setPhylloScriptLoaded(true);
        resolve();
      };
      script.onerror = (error) => {
        console.error('Failed to load Phyllo script:', error);
        reject(new Error('Failed to load Phyllo Connect script'));
      };
      document.head.appendChild(script);
    });
  };

  return { phylloScriptLoaded, loadPhylloScript };
};
