import { useState, useEffect } from 'react';
import { isSupabaseReady } from '@/integrations/supabase/safe-client';

/**
 * Safe hooks wrapper utilities
 * Implements patterns to prevent build-time initialization errors with Supabase
 * Based on loveable.dev implementation approach
 */

// Types for hook states
export type HookState<T> = {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  data: T | null;
  isReady: boolean;
};

// Initial state for hooks
export const createInitialState = <T>(initialData: T | null = null): HookState<T> => ({
  isLoading: false,
  isError: false,
  error: null,
  data: initialData,
  isReady: false,
});

/**
 * Creates a safe version of a hook that depends on Supabase
 * @param useHook The original hook function
 * @param fallbackData Optional fallback data when Supabase is not available
 */
export function createSafeHook<T, P extends any[]>(
  useHook: (...args: P) => T,
  fallbackData: T | null = null
) {
  return (...args: P): T => {
    // Check if we're in a browser and if Supabase is ready
    const supabaseReady = isSupabaseReady();
    
    // If Supabase is not ready, return fallback data
    if (!supabaseReady) {
      return fallbackData as T;
    }

    // Otherwise, call the original hook
    try {
      return useHook(...args);
    } catch (error) {
      console.error('Error in safe hook:', error);
      return fallbackData as T;
    }
  };
}

/**
 * Creates a safe version of a query hook that depends on Supabase
 * Provides loading, error states and retry functionality
 */
export function createSafeQueryHook<T, P extends any[]>(
  useQueryHook: (...args: P) => { data: T | null; isLoading: boolean; error: any },
  fallbackData: T | null = null
) {
  return (...args: P) => {
    const [state, setState] = useState<HookState<T>>(createInitialState(fallbackData));
    const [retryCount, setRetryCount] = useState(0);
    
    // Check if we're in a browser and if Supabase is ready
    const supabaseReady = isSupabaseReady();

    useEffect(() => {
      if (!supabaseReady) {
        setState({
          isLoading: false,
          isError: false,
          error: null,
          data: fallbackData,
          isReady: false,
        });
        return;
      }

      setState(prev => ({ ...prev, isLoading: true, isReady: true }));
      
      try {
        // Call the original hook
        const result = useQueryHook(...args);
        
        // Update state based on the result
        setState({
          isLoading: result.isLoading,
          isError: !!result.error,
          error: result.error || null,
          data: result.data,
          isReady: true,
        });
      } catch (error) {
        console.error('Error in safe query hook:', error);
        setState({
          isLoading: false,
          isError: true,
          error: error instanceof Error ? error : new Error('Unknown error in hook'),
          data: fallbackData,
          isReady: true,
        });
      }
    }, [supabaseReady, retryCount, ...args]);

    // Retry function
    const retry = () => {
      setRetryCount(count => count + 1);
    };

    return {
      ...state,
      retry,
    };
  };
}

/**
 * Creates a safe version of a mutation hook that depends on Supabase
 */
export function createSafeMutationHook<T, V, P extends any[]>(
  useMutationHook: (...args: P) => { 
    mutateAsync: (variables: V) => Promise<T>;
    isPending: boolean;
    error: any;
  }
) {
  return (...args: P) => {
    const [state, setState] = useState({
      isPending: false,
      isError: false,
      error: null as Error | null,
      isReady: false,
    });
    
    // Check if we're in a browser and if Supabase is ready
    const supabaseReady = isSupabaseReady();

    // If Supabase is not ready, return a mock mutation
    if (!supabaseReady) {
      return {
        ...state,
        isReady: false,
        mutateAsync: async () => {
          throw new Error('Supabase is not available');
        },
      };
    }

    // Otherwise, call the original hook
    try {
      const mutation = useMutationHook(...args);
      
      // Create a wrapped mutateAsync function
      const safeMutateAsync = async (variables: V): Promise<T> => {
        setState({ isPending: true, isError: false, error: null, isReady: true });
        try {
          const result = await mutation.mutateAsync(variables);
          setState({ isPending: false, isError: false, error: null, isReady: true });
          return result;
        } catch (error) {
          setState({
            isPending: false,
            isError: true,
            error: error instanceof Error ? error : new Error('Unknown error in mutation'),
            isReady: true,
          });
          throw error;
        }
      };

      return {
        isPending: mutation.isPending,
        isError: !!mutation.error,
        error: mutation.error,
        isReady: true,
        mutateAsync: safeMutateAsync,
      };
    } catch (error) {
      console.error('Error in safe mutation hook:', error);
      return {
        isPending: false,
        isError: true,
        error: error instanceof Error ? error : new Error('Unknown error in hook'),
        isReady: true,
        mutateAsync: async () => {
          throw new Error('Hook initialization failed');
        },
      };
    }
  };
}

/**
 * Hook to check if a component should render based on Supabase availability
 * Use this for components that depend on Supabase
 */
export function useSafeRender() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const supabaseReady = isSupabaseReady();
  
  return {
    shouldRender: isClient && supabaseReady,
    isClient,
    supabaseReady,
  };
}

/**
 * HOC to make a component safe from Supabase initialization errors
 * @param Component The component to wrap
 * @param LoadingComponent Optional loading component
 * @param ErrorComponent Optional error component
 */
export function withSafeSupabase<P extends object>(
  Component: React.ComponentType<P>,
  LoadingComponent: React.ComponentType = () => <div>Loading...</div>,
  ErrorComponent: React.ComponentType = () => <div>Service unavailable</div>
) {
  return (props: P) => {
    const { shouldRender, isClient, supabaseReady } = useSafeRender();
    
    if (!isClient) {
      return <LoadingComponent />;
    }
    
    if (!supabaseReady) {
      return <ErrorComponent />;
    }
    
    return <Component {...props} />;
  };
}
