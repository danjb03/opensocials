
import { AlertTriangle, RefreshCw, Home, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CampaignErrorProps {
  error: string;
  onRetry: () => void;
  onGoHome?: () => void;
  type?: 'network' | 'server' | 'permission' | 'general';
}

export function CampaignError({ 
  error, 
  onRetry, 
  onGoHome,
  type = 'general' 
}: CampaignErrorProps) {
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
            <Button 
              onClick={onRetry}
              className="flex-1 gap-2"
              variant="default"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            
            {onGoHome && (
              <Button 
                onClick={onGoHome}
                variant="outline"
                className="flex-1 gap-2"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
