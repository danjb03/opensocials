
import { useState, useEffect, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { engagementData as mockEngagementData } from './mock-data';

// Fallback engagement data
const fallbackEngagementData = [
  { name: 'Week 1', likes: 1200, comments: 150, shares: 80 },
  { name: 'Week 2', likes: 1500, comments: 200, shares: 120 },
  { name: 'Week 3', likes: 1800, comments: 180, shares: 95 },
  { name: 'Week 4', likes: 2200, comments: 250, shares: 140 }
];

export const EngagementTab = memo(() => {
  const [engagementData, setEngagementData] = useState(fallbackEngagementData);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadMockData = () => {
      try {
        setEngagementData(mockEngagementData || fallbackEngagementData);
      } catch (error) {
        // Fallback data is already set in state
      } finally {
        setIsLoadingData(false);
      }
    };

    loadMockData();
  }, []);

  if (isLoadingData) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
        </CardHeader>
        <CardContent className="pt-6 pb-8">
          <div className="h-[450px] bg-gray-50 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Engagement Metrics</CardTitle>
        <CardDescription>Likes, comments, and shares over time</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 pb-8">
        <div className="h-[450px] w-full">
          {engagementData && engagementData.length > 0 ? (
            <ChartContainer 
              config={{ 
                likes: { label: "Likes", theme: { light: "#F97316", dark: "#EA580C" } },
                comments: { label: "Comments", theme: { light: "#9b87f5", dark: "#7E69AB" } },
                shares: { label: "Shares", theme: { light: "#0EA5E9", dark: "#0284C7" } },
              }}
            >
              <BarChart 
                data={engagementData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend verticalAlign="top" height={36} />
                <Bar 
                  dataKey="likes" 
                  fill="var(--color-likes)" 
                  barSize={20} 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="comments" 
                  fill="var(--color-comments)" 
                  barSize={20} 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="shares" 
                  fill="var(--color-shares)" 
                  barSize={20} 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No engagement data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
