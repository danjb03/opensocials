
import { useState, useCallback } from 'react';

interface UseRetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  backoffFactor?: number;
}

export function useRetry(
  asyncFunction: () => Promise<any>,
  options: UseRetryOptions = {}
) {
  const { maxAttempts = 3, initialDelay = 1000, backoffFactor = 2 } = options;
  const [isRetrying, setIsRetrying] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(async () => {
    setIsRetrying(true);
    let currentAttempt = 0;
    
    while (currentAttempt < maxAttempts) {
      try {
        const result = await asyncFunction();
        setIsRetrying(false);
        setAttempt(0);
        return result;
      } catch (error) {
        currentAttempt++;
        setAttempt(currentAttempt);
        
        if (currentAttempt >= maxAttempts) {
          setIsRetrying(false);
          throw error;
        }
        
        const delay = initialDelay * Math.pow(backoffFactor, currentAttempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }, [asyncFunction, maxAttempts, initialDelay, backoffFactor]);

  return { retry, isRetrying, attempt };
}
