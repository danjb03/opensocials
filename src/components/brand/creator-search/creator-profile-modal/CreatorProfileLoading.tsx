
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const CreatorProfileLoading = () => {
  return (
    <div className="space-y-6">
      {/* Banner and Avatar Loading */}
      <div className="relative">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="absolute w-16 h-16 rounded-full -bottom-8 left-6 border-4 border-background" />
      </div>
      
      {/* Header Loading */}
      <div className="pt-10 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Content Loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
        </div>
      </div>
      
      {/* Action Buttons Loading */}
      <div className="flex justify-end gap-3 pt-4">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
  );
};
