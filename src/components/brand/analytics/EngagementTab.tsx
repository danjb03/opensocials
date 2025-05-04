
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { engagementData } from './mock-data';

export const EngagementTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Metrics</CardTitle>
        <CardDescription>Likes, comments, and shares over time</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 pb-8">
        <div className="h-[400px] w-full">
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
        </div>
      </CardContent>
    </Card>
  );
};
