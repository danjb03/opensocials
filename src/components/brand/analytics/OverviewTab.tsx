
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from 'recharts';
import { Bar, BarChart } from 'recharts';
import { audienceData, platformData, reachData } from './mock-data';

export const OverviewTab = () => {
  // Create a copy of audience data without percentages in labels
  const formattedAudienceData = audienceData.map(item => ({
    ...item,
    name: item.name.replace(/: \d+%/, '') // Remove the percentage from the name
  }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124,892</div>
            <p className="text-xs text-muted-foreground">+14% from last campaign</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.28%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last campaign</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Content Pieces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Across 4 platforms</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Click-through Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.1%</div>
            <p className="text-xs text-muted-foreground">+0.4% from last campaign</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Campaign Performance Overview</CardTitle>
          <CardDescription>Total reach and engagement metrics over time</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-8">
          <div className="h-[450px] w-full">
            <ChartContainer 
              config={{ 
                reach: { label: "Reach", theme: { light: "#9b87f5", dark: "#7E69AB" } },
                impressions: { label: "Impressions", theme: { light: "#0EA5E9", dark: "#0284C7" } },
              }}
            >
              <LineChart 
                data={reachData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="reach" 
                  stroke="var(--color-reach)" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="impressions" 
                  stroke="var(--color-impressions)" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
            <CardDescription>Posts and engagement by platform</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-8">
            <div className="h-[450px] w-full">
              <ChartContainer 
                config={{ 
                  posts: { label: "Posts", theme: { light: "#F97316", dark: "#EA580C" } },
                  engagement: { label: "Engagement", theme: { light: "#0EA5E9", dark: "#0284C7" } },
                }}
              >
                <BarChart 
                  data={platformData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  layout="vertical"
                  barSize={40}
                  barGap={8}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    type="category"
                    dataKey="name" 
                    width={100}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend 
                    verticalAlign="top"
                    height={36}
                  />
                  <Bar dataKey="posts" fill="var(--color-posts)" />
                  <Bar dataKey="engagement" fill="var(--color-engagement)" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Audience Demographics</CardTitle>
            <CardDescription>Age breakdown of engaged users</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-8">
            <div className="h-[450px] w-full flex flex-col items-center justify-center">
              <div className="w-[250px] h-[250px] mb-4">
                <PieChart width={250} height={250}>
                  <Pie
                    data={formattedAudienceData}
                    cx={125}
                    cy={125}
                    labelLine={false}
                    outerRadius={100}
                    innerRadius={30}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {formattedAudienceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}`} />
                </PieChart>
              </div>
              <div className="w-full flex flex-wrap justify-center gap-4">
                {formattedAudienceData.map((entry, index) => (
                  <div key={`legend-${index}`} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-sm" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
