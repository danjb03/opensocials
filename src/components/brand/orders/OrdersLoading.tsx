
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import BrandLayout from '@/components/layouts/BrandLayout';

const OrdersLoading = () => {
  return (
    <BrandLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-12 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    </BrandLayout>
  );
};

export default OrdersLoading;
