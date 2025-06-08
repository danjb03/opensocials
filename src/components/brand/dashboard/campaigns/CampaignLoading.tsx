
import { SkeletonList } from '@/components/ui/skeleton-list';

export function CampaignLoading() {
  return (
    <div className="space-y-4 pt-4">
      <SkeletonList 
        count={4} 
        showAvatars={false}
        showBadges={true}
        staggered={true}
      />
    </div>
  );
}
