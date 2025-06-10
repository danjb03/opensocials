
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Users, TrendingUp, Eye, Heart } from 'lucide-react';

const SocialGrowth: React.FC = () => {
  // Mock data - in a real app, this would come from connected social platforms
  const growthData = [
    { month: 'Jan', followers: 12000, engagement: 3.2, views: 45000, likes: 2400 },
    { month: 'Feb', followers: 13200, engagement: 3.8, views: 52000, likes: 2800 },
    { month: 'Mar', followers: 14800, engagement: 4.1, views: 58000, likes: 3200 },
    { month: 'Apr', followers: 16500, engagement: 4.5, views: 65000, likes: 3600 },
    { month: 'May', followers: 18200, engagement: 4.8, views: 72000, likes: 4100 },
    { month: 'Jun', followers: 20000, engagement: 5.2, views: 80000, likes: 4800 },
  ];

  const currentMetrics = {
    followers: 20000,
    engagement: 5.2,
    avgViews: 80000,
    avgLikes: 4800
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Users className="h-5 w-5" />
          Social Growth
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <Users className="h-6 w-6 mx-auto mb-1 text-blue-400" />
            <div className="text-lg font-bold text-foreground">{currentMetrics.followers.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <TrendingUp className="h-6 w-6 mx-auto mb-1 text-green-400" />
            <div className="text-lg font-bold text-foreground">{currentMetrics.engagement}%</div>
            <div className="text-xs text-muted-foreground">Engagement</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <Eye className="h-6 w-6 mx-auto mb-1 text-purple-400" />
            <div className="text-lg font-bold text-foreground">{(currentMetrics.avgViews / 1000).toFixed(1)}K</div>
            <div className="text-xs text-muted-foreground">Avg Views</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <Heart className="h-6 w-6 mx-auto mb-1 text-red-400" />
            <div className="text-lg font-bold text-foreground">{(currentMetrics.avgLikes / 1000).toFixed(1)}K</div>
            <div className="text-xs text-muted-foreground">Avg Likes</div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-foreground">6-Month Growth Trend</h4>
          <ChartContainer
            config={{
              followers: { label: "Followers", theme: { light: "#2563eb", dark: "#60a5fa" } }
            }}
            className="h-[200px]"
          >
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
              <XAxis dataKey="month" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="followers" 
                stroke="var(--color-followers)" 
                strokeWidth={2} 
                dot={{ r: 4 }} 
              />
            </LineChart>
          </ChartContainer>
        </div>

        <div className="text-sm text-muted-foreground text-center">
          Connect your social platforms to see real-time analytics
        </div>

        <div className="p-3 bg-muted border border-border rounded-lg">
          <p className="text-sm text-foreground text-center">
            These stats update weekly. Keep posting to stay visible to brands.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialGrowth;
