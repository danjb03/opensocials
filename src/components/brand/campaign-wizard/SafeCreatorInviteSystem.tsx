
import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign } from 'lucide-react';

interface SafeCreatorInviteSystemProps {
  projectId: string;
  remainingBudget: number;
  currency?: string;
}

const LoadingFallback = ({ remainingBudget }: { remainingBudget: number }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        Invite Additional Creators
      </CardTitle>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4" />
          Remaining Budget: ${remainingBudget.toFixed(2)}
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
        <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex items-start gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const ErrorFallback = ({ remainingBudget, error }: { remainingBudget: number; error: Error }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        Creator Invites Unavailable
      </CardTitle>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4" />
          Remaining Budget: ${remainingBudget.toFixed(2)}
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="text-center py-8 text-gray-500">
        <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="mb-2">Creator invitation system is temporarily unavailable</p>
        <p className="text-sm mb-4">Please try again in a few moments</p>
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
const CreatorInviteSystem = React.lazy(() => 
  import('./CreatorInviteSystem').then(module => ({
    default: module.default
  })).catch(error => {
    console.error('Failed to load CreatorInviteSystem:', error);
    // Return a component that shows the error
    return {
      default: ({ remainingBudget }: SafeCreatorInviteSystemProps) => (
        <ErrorFallback remainingBudget={remainingBudget} error={error} />
      )
    };
  })
);

export const SafeCreatorInviteSystem: React.FC<SafeCreatorInviteSystemProps> = ({ 
  projectId, 
  remainingBudget, 
  currency = 'USD' 
}) => {
  return (
    <Suspense fallback={<LoadingFallback remainingBudget={remainingBudget} />}>
      <CreatorInviteSystem 
        projectId={projectId} 
        remainingBudget={remainingBudget} 
        currency={currency} 
      />
    </Suspense>
  );
};

export default SafeCreatorInviteSystem;
