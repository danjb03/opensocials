
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { TrendingUp, Eye, Heart, MessageCircle, Users, Zap } from 'lucide-react';
import { Creator } from '@/types/creator';

interface CreatorMetricsProps {
  creator: Creator;
}

export const CreatorMetrics = ({ creator }: CreatorMetricsProps) => {
  const engagementValue = parseFloat(creator.metrics?.engagementRate?.replace('%', '') || creator.engagement.replace('%', ''));
  
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
        <Zap className="h-5 w-5 text-primary" />
        Performance Metrics
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Followers */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-xs font-medium text-blue-700 bg-blue-200 px-2 py-1 rounded-full">
              Followers
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{creator.metrics?.followerCount || creator.followers}</p>
          <p className="text-xs text-blue-600 mt-1">Total audience reach</p>
        </div>
        
        {/* Engagement Rate */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Heart className="h-5 w-5 text-green-600" />
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="text-xs font-medium text-green-700 bg-green-200 px-2 py-1 rounded-full cursor-help">
                  Engagement
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 text-sm p-3">
                <p className="font-medium mb-2">Engagement Rate</p>
                <p className="text-gray-600">
                  Calculated as (likes + comments + shares) / followers × 100%. 
                  This shows how actively your audience interacts with your content.
                </p>
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-green-900">{creator.metrics?.engagementRate || creator.engagement}</p>
            {creator.metrics?.growthTrend && (
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                {creator.metrics.growthTrend}
              </div>
            )}
          </div>
          <Progress value={engagementValue} className="h-2 mt-2" />
        </div>
        
        {/* Average Views */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Eye className="h-5 w-5 text-purple-600" />
            <span className="text-xs font-medium text-purple-700 bg-purple-200 px-2 py-1 rounded-full">
              Avg Views
            </span>
          </div>
          <p className="text-xl font-bold text-purple-900">{creator.metrics?.avgViews || "N/A"}</p>
          <p className="text-xs text-purple-600 mt-1">Per post average</p>
        </div>
        
        {/* Average Likes */}
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl border border-pink-200">
          <div className="flex items-center justify-between mb-2">
            <MessageCircle className="h-5 w-5 text-pink-600" />
            <span className="text-xs font-medium text-pink-700 bg-pink-200 px-2 py-1 rounded-full">
              Avg Likes
            </span>
          </div>
          <p className="text-xl font-bold text-pink-900">{creator.metrics?.avgLikes || "N/A"}</p>
          <p className="text-xs text-pink-600 mt-1">Per post average</p>
        </div>
      </div>
      
      {/* Price Range */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium text-amber-900 mb-1">Collaboration Rate</h4>
            <p className="text-xs text-amber-700">Per post pricing range</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-amber-900">{creator.priceRange}</p>
            <p className="text-xs text-amber-600">USD</p>
          </div>
        </div>
      </div>
    </div>
  );
};
