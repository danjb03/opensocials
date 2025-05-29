
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from 'recharts';
import { Bar, BarChart } from 'recharts';

// Fallback data in case mock-data import fails
const fallbackAudienceData = [
  { name: '18-24', value: 28, color: '#0088FE' },
  { name: '25-34', value: 35, color: '#00C49F' },
  { name: '35-44', value: 22, color: '#FFBB28' },
  { name: '45-54', value: 10, color: '#FF8042' },
  { name: '55+', value: 5, color: '#8884D8' }
];

const fallbackPlatformData = [
  { name: 'Instagram', posts: 8, engagement: 5200 },
  { name: 'TikTok', posts: 4, engagement: 3800 },
  { name: 'YouTube', posts: 2, engagement: 2100 },
  { name: 'LinkedIn', posts: 3, engagement: 900 }
];

const fallbackReachData = [
  { name: 'Week 1', reach: 12000, impressions: 18000 },
  { name: 'Week 2', reach: 15000, impressions: 22000 },
  { name: 'Week 3', reach: 18000, impressions: 28000 },
  { name: 'Week 4', reach: 22000, impressions: 35000 }
];

export const OverviewTab = () => {
  // Try to import mock data, fallback to local data if it fails
  let audienceData = fallbackAudienceData;
  let platformData = fallbackPlatformData;
  let reachData = fallbackReachData;

  try {
    const mockData = require('./mock-data');
    audienceData = mockData.audienceData || fallbackAudienceData;
    platformData = mockData.platformData || fallbackPlatformData;
    reachData = mockData.reachData || fallbackReachData;
  } catch (error) {
    console.warn('Mock data not found, using fallback data');
  }

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
            {reachData && reachData.length > 0 ? (
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
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No performance data available
              </div>
            )}
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
              {platformData && platformData.length > 0 ? (
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
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No platform data available
                </div>
              )}
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
              {formattedAudienceData && formattedAudienceData.length > 0 ? (
                <>
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
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No audience data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
