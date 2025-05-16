
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Creator } from '@/types/creator';

interface CreatorMetricsProps {
  creator: Creator;
}

export const CreatorMetrics = ({ creator }: CreatorMetricsProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-muted/30 p-2 rounded-lg">
        <h3 className="text-[10px] text-muted-foreground mb-0.5">Followers</h3>
        <p className="text-sm font-semibold">{creator.metrics?.followerCount || creator.followers}</p>
      </div>
      
      <div className="bg-muted/30 p-2 rounded-lg">
        <h3 className="text-[10px] text-muted-foreground mb-0.5">Engagement Rate</h3>
        <div className="flex items-end gap-1">
          <p className="text-sm font-semibold">{creator.metrics?.engagementRate || creator.engagement}</p>
          <HoverCard>
            <HoverCardTrigger asChild>
              <span className="text-[10px] text-muted-foreground cursor-help">What's this?</span>
            </HoverCardTrigger>
            <HoverCardContent className="w-48 text-[10px] p-2">
              <p>
                Engagement rate is calculated as (likes + comments) / followers × 100%.
                This represents how much your audience interacts with your content.
              </p>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
      
      <div className="bg-muted/30 p-2 rounded-lg">
        <h3 className="text-[10px] text-muted-foreground mb-0.5">Average Views</h3>
        <p className="text-sm font-semibold">{creator.metrics?.avgViews || "Not available"}</p>
      </div>
      
      <div className="bg-muted/30 p-2 rounded-lg">
        <h3 className="text-[10px] text-muted-foreground mb-0.5">Average Likes</h3>
        <p className="text-sm font-semibold">{creator.metrics?.avgLikes || "Not available"}</p>
      </div>
      
      <div className="col-span-2 bg-muted/30 p-2 rounded-lg">
        <div className="flex justify-between items-center mb-0.5">
          <h3 className="text-[10px] text-muted-foreground">Price Range</h3>
          <p className="font-semibold text-xs">{creator.priceRange}</p>
        </div>
      </div>
    </div>
  );
};
