
import { Skeleton } from '@/components/ui/skeleton';

export function CampaignLoading() {
  return (
    <div className="space-y-4 pt-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col md:flex-row justify-between gap-4 p-4 border border-slate-100 rounded-lg">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-20 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
