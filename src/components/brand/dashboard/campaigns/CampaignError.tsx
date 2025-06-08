
import React, { memo } from 'react';
import { AlertTriangle, RefreshCw, Home, Wifi } from 'lucide-react';
import { AccessibleButton } from '@/components/ui/accessible-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CampaignErrorProps {
  error: string;
  onRetry: () => Promise<void> | void;
  onGoHome?: () => void;
  type?: 'network' | 'server' | 'permission' | 'general';
}

const CampaignErrorMemo = memo(({ 
  error, 
  onRetry, 
  onGoHome,
  type = 'general' 
}: CampaignErrorProps) => {
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await Promise.resolve(onRetry());
    } catch (err) {
      console.error('Retry failed:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  const getErrorConfig = () => {
    switch (type) {
      case 'network':
        return {
          icon: Wifi,
          title: 'Connection Problem',
          suggestion: 'Check your internet connection and try again.',
          color: 'text-blue-600'
        };
      case 'server':
        return {
          icon: AlertTriangle,
          title: 'Server Error',
          suggestion: 'Our servers are experiencing issues. Please try again in a moment.',
          color: 'text-orange-600'
        };
      case 'permission':
        return {
          icon: AlertTriangle,
          title: 'Access Denied',
          suggestion: 'You may not have permission to view this content.',
          color: 'text-red-600'
        };
      default:
        return {
          icon: AlertTriangle,
          title: 'Something went wrong',
          suggestion: 'An unexpected error occurred. Please try again.',
          color: 'text-red-600'
        };
    }
  };

  const config = getErrorConfig();
  const IconComponent = config.icon;

  return (
    <div className="flex items-center justify-center py-12 px-4 animate-fade-in">
      <Card className="w-full max-w-md border-destructive/20">
        <CardHeader className="text-center pb-4">
          <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 animate-scale-in`}>
            <IconComponent className={`h-6 w-6 ${config.color}`} />
          </div>
          <CardTitle className="text-lg text-foreground">
            {config.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {config.suggestion}
            </p>
            {error && (
              <details className="text-xs text-muted-foreground bg-muted/50 rounded p-2 cursor-pointer">
                <summary>Error details</summary>
                <code className="block mt-2 text-left">{error}</code>
              </details>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <AccessibleButton 
              onClick={handleRetry}
              className="flex-1"
              variant="default"
              loading={isRetrying}
              loadingText="Retrying..."
              aria-label="Retry the failed operation"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </AccessibleButton>
            
            {onGoHome && (
              <AccessibleButton 
                onClick={onGoHome}
                variant="outline"
                className="flex-1"
                aria-label="Go to home page"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </AccessibleButton>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

CampaignErrorMemo.displayName = 'CampaignError';

export { CampaignErrorMemo as CampaignError };
