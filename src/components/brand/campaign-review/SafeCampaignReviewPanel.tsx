
import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

interface SafeCampaignReviewPanelProps {
  campaignId: string;
  campaignName: string;
}

const LoadingFallback = ({ campaignName }: { campaignName: string }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-foreground">{campaignName} - Content Review</h2>
      <p className="text-muted-foreground">Loading review interface...</p>
    </div>
    
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Loading Submissions...</h3>
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-20 bg-gray-100 rounded animate-pulse" />
              <div className="flex space-x-2">
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-36 bg-gray-200 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

const ErrorFallback = ({ campaignName, error }: { campaignName: string; error: Error }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-foreground">{campaignName} - Content Review</h2>
      <p className="text-muted-foreground">Content review temporarily unavailable</p>
    </div>
    
    <Card>
      <CardContent className="pt-6 text-center">
        <Eye className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Review System Unavailable</h3>
        <p className="text-gray-500 mb-4">
          The content review system is temporarily unavailable. Please try again in a few moments.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Try Again
        </button>
      </CardContent>
    </Card>
  </div>
);

// Lazy load the actual component
const CampaignReviewPanel = React.lazy(() => 
  import('./CampaignReviewPanel').then(module => ({
    default: module.default
  })).catch(error => {
    console.error('Failed to load CampaignReviewPanel:', error);
    // Return a component that shows the error
    return {
      default: ({ campaignName }: SafeCampaignReviewPanelProps) => (
        <ErrorFallback campaignName={campaignName} error={error} />
      )
    };
  })
);

export const SafeCampaignReviewPanel: React.FC<SafeCampaignReviewPanelProps> = ({ 
  campaignId, 
  campaignName 
}) => {
  return (
    <Suspense fallback={<LoadingFallback campaignName={campaignName} />}>
      <CampaignReviewPanel campaignId={campaignId} campaignName={campaignName} />
    </Suspense>
  );
};

export default SafeCampaignReviewPanel;
