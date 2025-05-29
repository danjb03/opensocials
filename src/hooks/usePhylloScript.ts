
import { useState } from 'react';

export const usePhylloScript = () => {
  const [phylloScriptLoaded, setPhylloScriptLoaded] = useState(false);

  const loadPhylloScript = () => {
    return new Promise<void>((resolve, reject) => {
      // Check if already loaded and ready
      if (phylloScriptLoaded && window.PhylloConnect && typeof window.PhylloConnect.initialize === 'function') {
        console.log('Phyllo script already loaded and ready');
        resolve();
        return;
      }

      // Check if script already exists in DOM
      const existingScript = document.querySelector('script[src*="phyllo-connect"]');
      if (existingScript) {
        console.log('Phyllo script tag found, waiting for initialization...');
        
        // Wait for the script to be ready
        const checkReady = (attempts = 0) => {
          if (window.PhylloConnect && typeof window.PhylloConnect.initialize === 'function') {
            console.log('Phyllo script is ready');
            setPhylloScriptLoaded(true);
            resolve();
          } else if (attempts < 20) {
            setTimeout(() => checkReady(attempts + 1), 250);
          } else {
            console.error('Phyllo script loaded but PhylloConnect not available');
            reject(new Error('Phyllo Connect not available after script load'));
          }
        };
        
        checkReady();
        return;
      }

      console.log('Loading Phyllo script from CDN...');
      const script = document.createElement('script');
      script.src = 'https://cdn.getphyllo.com/connect/v2/phyllo-connect.js';
      script.async = true;
      
      script.onload = () => {
        console.log('Phyllo script loaded successfully, checking availability...');
        
        // Wait for PhylloConnect to be available
        const checkAvailable = (attempts = 0) => {
          if (window.PhylloConnect && typeof window.PhylloConnect.initialize === 'function') {
            console.log('PhylloConnect is available and ready');
            setPhylloScriptLoaded(true);
            resolve();
          } else if (attempts < 20) {
            setTimeout(() => checkAvailable(attempts + 1), 250);
          } else {
            console.error('PhylloConnect not available after script load');
            reject(new Error('PhylloConnect not available after script load'));
          }
        };
        
        checkAvailable();
      };
      
      script.onerror = (error) => {
        console.error('Failed to load Phyllo script:', error);
        reject(new Error('Failed to load Phyllo Connect script from CDN'));
      };
      
      document.head.appendChild(script);
    });
  };

  return { phylloScriptLoaded, loadPhylloScript };
};
