
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface SomethingWentWrongProps {
  error?: Error | string | null;
  resetErrorBoundary?: () => void;
}

const SomethingWentWrong: React.FC<SomethingWentWrongProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  // Bulletproof error message extraction
  const errorMessage = typeof error === 'string'
    ? error
    : error?.message || 'An unexpected error occurred';

  const handleRetry = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Oops. Something went wrong.</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            {errorMessage}
          </p>
          <div className="flex justify-center">
            <Button onClick={handleRetry} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SomethingWentWrong;
