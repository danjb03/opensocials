
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const CreatorProfileLoading = () => {
  return (
    <>
      <div className="relative w-full h-16 bg-muted/30">
        <Skeleton className="absolute w-12 h-12 rounded-full -bottom-6 left-4 border-4 border-background" />
      </div>
      <div className="pt-8 px-4 pb-4">
        <Skeleton className="h-4 w-1/3 mb-2" />
        <Skeleton className="h-3 w-1/4 mb-4" />
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-3/4 mb-4" />
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Skeleton className="h-12 rounded-md" />
          <Skeleton className="h-12 rounded-md" />
          <Skeleton className="h-12 rounded-md" />
          <Skeleton className="h-12 rounded-md" />
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </>
  );
};
