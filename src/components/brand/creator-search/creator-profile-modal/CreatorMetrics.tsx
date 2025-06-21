
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { TrendingUp, Eye, Heart, MessageCircle, Users, Zap } from 'lucide-react';
import { Creator } from '@/types/creator';

interface CreatorMetricsProps {
  creator: Creator;
}

export const CreatorMetrics = ({ creator }: CreatorMetricsProps) => {
  // Parse engagement rate safely - use metrics first, then fallback
  const engagementRateString = creator.metrics?.engagementRate || creator.engagement || '0%';
  const engagementValue = parseFloat(engagementRateString.replace('%', ''));
  
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
        <Zap className="h-5 w-5 text-foreground" />
        Performance Metrics
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Followers - Use live data */}
        <div className="bg-muted/30 p-4 rounded-xl border border-border">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-foreground" />
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
              Followers
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {creator.metrics?.followerCount || creator.followers}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Total audience reach</p>
        </div>
        
        {/* Engagement Rate - Use live data */}
        <div className="bg-muted/30 p-4 rounded-xl border border-border">
          <div className="flex items-center justify-between mb-2">
            <Heart className="h-5 w-5 text-foreground" />
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full cursor-help">
                  Engagement
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 text-sm p-3">
                <p className="font-medium mb-2">Engagement Rate</p>
                <p className="text-muted-foreground">
                  Calculated as (likes + comments + shares) / followers × 100%. 
                  This shows how actively your audience interacts with your content.
                </p>
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-foreground">
              {creator.metrics?.engagementRate || creator.engagement}
            </p>
            {creator.metrics?.growthTrend && (
              <div className="flex items-center text-xs text-foreground">
                <TrendingUp className="h-3 w-3 mr-1" />
                {creator.metrics.growthTrend}
              </div>
            )}
          </div>
          <Progress value={engagementValue} className="h-2 mt-2" />
        </div>
        
        {/* Average Views - Use live data */}
        <div className="bg-muted/30 p-4 rounded-xl border border-border">
          <div className="flex items-center justify-between mb-2">
            <Eye className="h-5 w-5 text-foreground" />
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
              Avg Views
            </span>
          </div>
          <p className="text-xl font-bold text-foreground">
            {creator.metrics?.avgViews || "N/A"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Per post average</p>
        </div>
        
        {/* Average Likes - Use live data */}
        <div className="bg-muted/30 p-4 rounded-xl border border-border">
          <div className="flex items-center justify-between mb-2">
            <MessageCircle className="h-5 w-5 text-foreground" />
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
              Avg Likes
            </span>
          </div>
          <p className="text-xl font-bold text-foreground">
            {creator.metrics?.avgLikes || "N/A"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Per post average</p>
        </div>
      </div>
      
      {/* Price Range - Show contact for pricing instead of hardcoded values */}
      <div className="bg-muted/30 border border-border rounded-xl p-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium text-foreground mb-1">Collaboration Rate</h4>
            <p className="text-xs text-muted-foreground">Contact creator for current rates</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-foreground">{creator.priceRange}</p>
            <p className="text-xs text-muted-foreground">USD</p>
          </div>
        </div>
      </div>
    </div>
  );
};
