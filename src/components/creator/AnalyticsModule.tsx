
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Badge } from '@/components/ui/badge';

interface PlatformMetrics {
  followers: string;
  engagement: string;
  views: string;
  likes: string;
  growthRate?: string;
  verified?: boolean;
  chartData?: Array<{date: string, value: number}>;
  topPosts?: Array<{title: string, views: number, likes: number}>;
}

interface AnalyticsModuleProps {
  platform: string;
  metrics: PlatformMetrics;
  isVisible?: boolean;
}

const AnalyticsModule: React.FC<AnalyticsModuleProps> = ({
  platform,
  metrics,
  isVisible = true
}) => {
  if (!isVisible) return null;

  const dummyChartData = metrics.chartData || [
    {date: 'Jan', value: 2400},
    {date: 'Feb', value: 1398},
    {date: 'Mar', value: 9800},
    {date: 'Apr', value: 3908},
    {date: 'May', value: 4800},
    {date: 'Jun', value: 3800},
  ];
  
  const dummyTopPosts = metrics.topPosts || [
    {title: 'How I gained 10K followers', views: 45000, likes: 12000},
    {title: 'My morning routine', views: 32000, likes: 9000},
    {title: 'Brand partnership reveal', views: 28000, likes: 7500},
  ];

  return (
    <Card className={`${!isVisible ? 'hidden' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">{platform} Analytics</CardTitle>
          <CardDescription>
            Performance and engagement statistics
          </CardDescription>
        </div>
        <div>
          {metrics.verified && (
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
              Verified
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-secondary/20 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Followers</p>
            <p className="font-semibold text-lg">{metrics.followers}</p>
          </div>
          <div className="bg-secondary/20 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Engagement</p>
            <p className="font-semibold text-lg">{metrics.engagement}</p>
          </div>
          <div className="bg-secondary/20 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Avg. Views</p>
            <p className="font-semibold text-lg">{metrics.views}</p>
          </div>
          <div className="bg-secondary/20 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Avg. Likes</p>
            <p className="font-semibold text-lg">{metrics.likes}</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Follower Growth Trend</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dummyChartData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Top Performing Content</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dummyTopPosts}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#8884d8" />
                  <Bar dataKey="likes" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsModule;
