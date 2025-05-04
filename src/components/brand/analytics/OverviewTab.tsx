
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, LineChart, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from 'recharts';
import { audienceData, platformData, reachData } from './mock-data';

export const OverviewTab = () => {
  return (
    <div className="space-y-4">
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
      
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Campaign Performance Overview</CardTitle>
          <CardDescription>Total reach and engagement metrics over time</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
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
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
            <CardDescription>Posts and engagement by platform</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <ChartContainer 
              config={{ 
                posts: { label: "Posts", theme: { light: "#F97316", dark: "#EA580C" } },
                engagement: { label: "Engagement", theme: { light: "#0EA5E9", dark: "#0284C7" } },
              }}
            >
              <BarChart 
                data={platformData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={0} 
                  textAnchor="middle"
                  height={60}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend 
                  verticalAlign="top"
                  height={36}
                />
                <BarChart.Bar yAxisId="left" dataKey="posts" fill="var(--color-posts)" barSize={30} />
                <BarChart.Bar yAxisId="right" dataKey="engagement" fill="var(--color-engagement)" barSize={30} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audience Demographics</CardTitle>
            <CardDescription>Age breakdown of engaged users</CardDescription>
          </CardHeader>
          <CardContent className="h-96 flex items-center justify-center">
            <PieChart width={400} height={300} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={audienceData}
                cx={200}
                cy={150}
                labelLine={true}
                outerRadius={100}
                innerRadius={0}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {audienceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value}%`} />
              <Legend
                verticalAlign="bottom"
                height={36}
                payload={audienceData.map(entry => ({
                  value: `${entry.name}: ${entry.value}%`,
                  color: entry.color,
                  type: 'square'
                }))}
              />
            </PieChart>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
