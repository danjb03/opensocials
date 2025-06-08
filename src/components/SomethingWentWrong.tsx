
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

interface SomethingWentWrongProps {
  error?: Error | string | null;
  resetErrorBoundary?: () => void;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  customMessage?: string;
}

const SomethingWentWrong: React.FC<SomethingWentWrongProps> = ({ 
  error, 
  resetErrorBoundary,
  showHomeButton = true,
  showBackButton = false,
  customMessage
}) => {
  const errorMessage = customMessage || (typeof error === 'string'
    ? error
    : error?.message || 'An unexpected error occurred');

  const handleRetry = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  const handleHome = () => {
    window.location.href = '/';
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background animate-fade-in">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 animate-scale-in">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-xl text-foreground">Oops! Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {errorMessage}
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleRetry} 
              className="w-full gap-2 bg-primary hover:bg-primary/90"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            
            <div className="flex gap-2">
              {showBackButton && (
                <Button 
                  onClick={handleBack} 
                  variant="outline" 
                  className="flex-1 gap-2 hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Button>
              )}
              
              {showHomeButton && (
                <Button 
                  onClick={handleHome} 
                  variant="outline" 
                  className="flex-1 gap-2 hover:bg-muted"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              )}
            </div>
          </div>
          
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              If this problem persists, please contact support
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SomethingWentWrong;
