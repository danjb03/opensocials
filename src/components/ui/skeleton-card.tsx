
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonCardProps {
  className?: string;
  showAvatar?: boolean;
  showBadge?: boolean;
  lines?: number;
}

export function SkeletonCard({ 
  className, 
  showAvatar = false, 
  showBadge = false, 
  lines = 2 
}: SkeletonCardProps) {
  return (
    <div className={cn("p-4 border border-slate-100 rounded-lg", className)}>
      <div className="flex items-start gap-3">
        {showAvatar && (
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
        )}
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            {showBadge && <Skeleton className="h-5 w-16 rounded-full" />}
          </div>
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton key={i} className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
          ))}
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
