
import React, { useState, useEffect, Suspense } from 'react';
import { EmergencyFallback } from './EmergencyFallback';

interface ProgressiveLoaderProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
  timeout?: number;
}

export const ProgressiveLoader: React.FC<ProgressiveLoaderProps> = ({ 
  children, 
  fallback: FallbackComponent = EmergencyFallback,
  timeout = 3000 
}) => {
  const [hasError, setHasError] = useState(false);
  const [forceEmergency, setForceEmergency] = useState(false);

  useEffect(() => {
    // Emergency timeout - if nothing renders in 3 seconds, show fallback
    const emergencyTimer = setTimeout(() => {
      console.log('⚡ EMERGENCY: Progressive loader timeout, showing fallback');
      setForceEmergency(true);
    }, timeout);

    return () => clearTimeout(emergencyTimer);
  }, [timeout]);

  // Catch any render errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('🚨 Progressive loader caught error:', event.error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError || forceEmergency) {
    return <FallbackComponent />;
  }

  return (
    <Suspense fallback={<FallbackComponent />}>
      {children}
    </Suspense>
  );
};
