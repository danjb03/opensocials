import React, { Suspense, lazy, useState, useEffect } from 'react';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { isSupabaseReady } from '@/integrations/supabase/safe-client';

/**
 * Safe Component Wrappers
 * Implements the pattern from loveable.dev to prevent build-time initialization errors
 * Uses React.lazy and Suspense to ensure components only initialize when ready
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// ======= Loading Components =======

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export const LoadingCard = ({ message = "Loading content..." }) => (
  <Card className="w-full">
    <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </CardContent>
  </Card>
);

// ======= Error Components =======

interface ErrorComponentProps {
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ErrorMessage = ({ 
  message = "Something went wrong while loading this component.", 
  onRetry,
  showRetry = true 
}: ErrorComponentProps) => (
  <div className="flex flex-col items-center justify-center p-6 text-center">
    <AlertCircle className="h-8 w-8 text-destructive mb-4" />
    <p className="text-muted-foreground mb-4">{message}</p>
    {showRetry && onRetry && (
      <Button onClick={onRetry} variant="outline" size="sm">
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry
      </Button>
    )}
  </div>
);

export const ErrorCard = ({ 
  message = "Something went wrong while loading this component.", 
  onRetry,
  showRetry = true 
}: ErrorComponentProps) => (
  <Card className="w-full">
    <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
      <AlertCircle className="h-8 w-8 text-destructive mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </CardContent>
    {showRetry && onRetry && (
      <CardFooter className="flex justify-center pb-6">
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </CardFooter>
    )}
  </Card>
);

// ======= Safe Component Wrapper =======

/**
 * Generic safe component wrapper that prevents build-time initialization errors
 * @param importFn Function that imports the component
 * @param LoadingComponent Component to show while loading
 * @param ErrorComponent Component to show on error
 * @param errorMessage Error message to display
 */
export function createSafeComponent<P extends object>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>,
  LoadingComponent: React.ComponentType = LoadingSpinner,
  ErrorComponent: React.ComponentType<ErrorComponentProps> = ErrorMessage,
  errorMessage: string = "This component is currently unavailable."
) {
  // Use React.lazy for code splitting and to prevent build-time initialization
  const LazyComponent = lazy(importFn);
  
  // Return a component that safely renders the lazy-loaded component
  return (props: P) => {
    const [error, setError] = useState<Error | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const [isClient, setIsClient] = useState(false);
    
    // Set isClient to true after mount to ensure we're in the browser
    useEffect(() => {
      setIsClient(true);
    }, []);
    
    // Check if Supabase is ready
    const supabaseReady = isSupabaseReady();
    
    // Handle retry
    const handleRetry = () => {
      setError(null);
      setRetryCount(count => count + 1);
    };
    
    // If we're not in the browser or Supabase isn't ready, show a loading state
    if (!isClient || !isBrowser) {
      return <LoadingComponent />;
    }
    
    // If Supabase isn't ready, show an error
    if (!supabaseReady) {
      return (
        <ErrorComponent 
          message={errorMessage} 
          onRetry={handleRetry}
          showRetry={true}
        />
      );
    }
    
    // If there was an error, show the error component
    if (error) {
      return (
        <ErrorComponent 
          message={error.message || errorMessage} 
          onRetry={handleRetry}
          showRetry={true}
        />
      );
    }
    
    // Render the component with Suspense
    return (
      <Suspense fallback={<LoadingComponent />}>
        <ErrorBoundary
          fallback={(error) => (
            <ErrorComponent 
              message={error.message || errorMessage} 
              onRetry={handleRetry}
              showRetry={true}
            />
          )}
          onError={setError}
          key={retryCount} // Force re-mount on retry
        >
          <LazyComponent {...props} />
        </ErrorBoundary>
      </Suspense>
    );
  };
}

// ======= Error Boundary =======

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: (error: Error) => React.ReactNode;
  onError?: (error: Error) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Component error:", error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render(): React.ReactNode {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback(this.state.error);
    }

    return this.props.children;
  }
}

// ======= Safe Content Review Components =======

/**
 * Safe CampaignReviewPanel component that prevents build-time initialization errors
 */
export const SafeCampaignReviewPanel = createSafeComponent(
  () => import('@/components/brand/campaign-review/CampaignReviewPanel'),
  LoadingCard,
  ErrorCard,
  "The content review panel is currently unavailable. Please try again later."
);

/**
 * Safe ContentUploader component that prevents build-time initialization errors
 */
export const SafeContentUploader = createSafeComponent(
  () => import('@/components/creator/campaigns/ContentUploader'),
  LoadingCard,
  ErrorCard,
  "The content uploader is currently unavailable. Please try again later."
);

/**
 * Safe SubmitProofForm component that prevents build-time initialization errors
 */
export const SafeSubmitProofForm = createSafeComponent(
  () => import('@/components/creator/campaigns/SubmitProofForm'),
  LoadingCard,
  ErrorCard,
  "The proof submission form is currently unavailable. Please try again later."
);

/**
 * Safe CampaignUploads component that prevents build-time initialization errors
 */
export const SafeCampaignUploads = createSafeComponent(
  () => import('@/components/creator/campaign-detail/CampaignUploads').then(
    module => ({ default: module.CampaignUploads })
  ),
  LoadingCard,
  ErrorCard,
  "The campaign uploads component is currently unavailable. Please try again later."
);

// ======= Progressive Enhancement Components =======

/**
 * Component that only renders its children when the client is ready
 * Implements progressive enhancement pattern
 */
export const ClientOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <>{children}</> : <>{fallback}</>;
};

/**
 * Component that only renders its children when Supabase is ready
 * Implements progressive enhancement pattern with Supabase
 */
export const SupabaseReady: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = <LoadingSpinner /> }) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const supabaseReady = isSupabaseReady();
  
  return (isClient && supabaseReady) ? <>{children}</> : <>{fallback}</>;
};
