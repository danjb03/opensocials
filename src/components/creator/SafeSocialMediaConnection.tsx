
import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LinkIcon } from 'lucide-react';

interface SafeSocialMediaConnectionProps {
  onConnectionSuccess?: () => void;
}

const LoadingFallback = () => (
  <Card className="shadow-sm">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center gap-3 text-xl">
        <div className="p-2 bg-primary rounded-lg">
          <LinkIcon className="h-5 w-5 text-white" />
        </div>
        Connect Your Social Media
      </CardTitle>
      <p className="text-sm text-muted-foreground mt-2">
        Loading social media connection interface...
      </p>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 rounded-xl border bg-gray-50 border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse" />
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
              <div className="w-20 h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const ErrorFallback = ({ error, onConnectionSuccess }: { error: Error; onConnectionSuccess?: () => void }) => (
  <Card className="shadow-sm border-yellow-200">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center gap-3 text-xl">
        <div className="p-2 bg-yellow-500 rounded-lg">
          <LinkIcon className="h-5 w-5 text-white" />
        </div>
        Social Media Connection
      </CardTitle>
      <p className="text-sm text-yellow-700 mt-2">
        Social media connection is temporarily unavailable. Please try again later.
      </p>
    </CardHeader>
    <CardContent>
      <div className="text-center py-8">
        <p className="text-sm text-gray-600 mb-4">
          We're working to restore this feature. You can continue using other parts of the platform.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    </CardContent>
  </Card>
);

// Lazy load the actual component
const SocialMediaConnection = React.lazy(() => 
  import('./SocialMediaConnection').then(module => ({
    default: module.SocialMediaConnection
  })).catch(error => {
    console.error('Failed to load SocialMediaConnection:', error);
    // Return a component that shows the error
    return {
      default: ({ onConnectionSuccess }: SafeSocialMediaConnectionProps) => (
        <ErrorFallback error={error} onConnectionSuccess={onConnectionSuccess} />
      )
    };
  })
);

export const SafeSocialMediaConnection: React.FC<SafeSocialMediaConnectionProps> = ({ 
  onConnectionSuccess 
}) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SocialMediaConnection onConnectionSuccess={onConnectionSuccess} />
    </Suspense>
  );
};

export default SafeSocialMediaConnection;
