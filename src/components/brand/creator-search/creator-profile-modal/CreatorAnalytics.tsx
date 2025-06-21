
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, Eye, Heart } from 'lucide-react';
import { Creator } from '@/types/creator';

interface CreatorAnalyticsProps {
  creator: Creator;
}

export const CreatorAnalytics = ({ creator }: CreatorAnalyticsProps) => {
  // Mock analytics data - in a real app, this would come from API
  const mockAnalytics = {
    avgViews: Math.floor(Math.random() * 50000 + 10000),
    avgLikes: Math.floor(Math.random() * 5000 + 1000),
    avgComments: Math.floor(Math.random() * 500 + 100),
    reachRate: Math.floor(Math.random() * 30 + 60), // 60-90%
    growthRate: Math.floor(Math.random() * 10 + 5), // 5-15%
    postFrequency: Math.floor(Math.random() * 5 + 3), // 3-8 posts per week
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Eye className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{formatNumber(mockAnalytics.avgViews)}</div>
              <div className="text-sm text-muted-foreground">Avg Views</div>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <Heart className="h-6 w-6 mx-auto mb-2 text-red-600" />
              <div className="text-2xl font-bold">{formatNumber(mockAnalytics.avgLikes)}</div>
              <div className="text-sm text-muted-foreground">Avg Likes</div>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <Users className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{mockAnalytics.reachRate}%</div>
              <div className="text-sm text-muted-foreground">Reach Rate</div>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">+{mockAnalytics.growthRate}%</div>
              <div className="text-sm text-muted-foreground">Growth Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audience Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Audience Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Engagement Quality</span>
                <span className="text-sm font-semibold">87%</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Audience Authenticity</span>
                <span className="text-sm font-semibold">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Brand Safety Score</span>
                <span className="text-sm font-semibold">95%</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Content Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Post Frequency</span>
                <Badge variant="outline">{mockAnalytics.postFrequency}/week</Badge>
              </div>
              <div className="flex justify-between">
                <span>Best Posting Time</span>
                <Badge variant="outline">6-8 PM</Badge>
              </div>
              <div className="flex justify-between">
                <span>Top Content Type</span>
                <Badge variant="outline">Reels</Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Avg Comments</span>
                <Badge variant="outline">{formatNumber(mockAnalytics.avgComments)}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Save Rate</span>
                <Badge variant="outline">12.3%</Badge>
              </div>
              <div className="flex justify-between">
                <span>Share Rate</span>
                <Badge variant="outline">8.7%</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
