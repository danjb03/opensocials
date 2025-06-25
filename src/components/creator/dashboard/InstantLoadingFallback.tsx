
import React from 'react';

// Ultra-fast loading state that appears instantly
const InstantLoadingFallback: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Instant skeleton that matches the actual layout */}
      <div className="container mx-auto p-6 space-y-6">
        {/* Welcome section skeleton */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </div>

        {/* Stats cards skeleton */}
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg p-6 border border-border">
              <div className="animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 w-4 bg-muted rounded"></div>
                </div>
                <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Content sections skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-card rounded-lg p-6 border border-border">
            <div className="animate-pulse space-y-4">
              <div className="h-5 bg-muted rounded w-1/2"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 bg-card rounded-lg p-6 border border-border">
            <div className="animate-pulse">
              <div className="h-5 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstantLoadingFallback;
