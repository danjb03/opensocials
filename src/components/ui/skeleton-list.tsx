
import { SkeletonCard } from "./skeleton-card";

interface SkeletonListProps {
  count?: number;
  showAvatars?: boolean;
  showBadges?: boolean;
  staggered?: boolean;
}

export function SkeletonList({ 
  count = 3, 
  showAvatars = false, 
  showBadges = false,
  staggered = true 
}: SkeletonListProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={staggered ? "animate-fade-in" : ""}
          style={staggered ? { animationDelay: `${i * 100}ms` } : undefined}
        >
          <SkeletonCard 
            showAvatar={showAvatars}
            showBadge={showBadges}
            lines={2}
          />
        </div>
      ))}
    </div>
  );
}
