
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart, Pie, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { CalendarDays, ArrowLeft, Download, Share2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Mock data for demonstration - this would be replaced by real data from API
const engagementData = [
  { name: 'Day 1', likes: 400, comments: 240, shares: 100 },
  { name: 'Day 2', likes: 300, comments: 139, shares: 80 },
  { name: 'Day 3', likes: 200, comments: 980, shares: 200 },
  { name: 'Day 4', likes: 278, comments: 390, shares: 150 },
  { name: 'Day 5', likes: 189, comments: 480, shares: 120 },
  { name: 'Day 6', likes: 239, comments: 380, shares: 110 },
  { name: 'Day 7', likes: 349, comments: 430, shares: 190 },
];

const reachData = [
  { name: 'Day 1', reach: 1400, impressions: 2400 },
  { name: 'Day 2', reach: 1300, impressions: 1398 },
  { name: 'Day 3', reach: 2000, impressions: 9800 },
  { name: 'Day 4', reach: 2780, impressions: 3908 },
  { name: 'Day 5', reach: 1890, impressions: 4800 },
  { name: 'Day 6', reach: 2390, impressions: 3800 },
  { name: 'Day 7', reach: 3490, impressions: 4300 },
];

const audienceData = [
  { name: 'Age 18-24', value: 30 },
  { name: 'Age 25-34', value: 40 },
  { name: 'Age 35-44', value: 15 },
  { name: 'Age 45+', value: 15 },
];

const platformData = [
  { name: 'Instagram', posts: 4, engagement: 4000 },
  { name: 'TikTok', posts: 3, engagement: 3000 },
  { name: 'YouTube', posts: 2, engagement: 2000 },
  { name: 'Twitter', posts: 3, engagement: 1500 },
];

const CampaignAnalytics = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <BrandLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaign
            </Button>
            <h1 className="text-3xl font-bold">Campaign Analytics</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline">
              <CalendarDays className="h-4 w-4 mr-2" />
              Last 7 Days
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 gap-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="content">Content Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
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
              <CardContent className="h-80">
                <ChartContainer 
                  config={{ 
                    reach: { label: "Reach", theme: { light: "#9b87f5", dark: "#7E69AB" } },
                    impressions: { label: "Impressions", theme: { light: "#0EA5E9", dark: "#0284C7" } },
                  }}
                >
                  <LineChart data={reachData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="reach" stroke="var(--color-reach)" strokeWidth={2} />
                    <Line type="monotone" dataKey="impressions" stroke="var(--color-impressions)" strokeWidth={2} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Performance</CardTitle>
                  <CardDescription>Posts and engagement by platform</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ChartContainer 
                    config={{ 
                      posts: { label: "Posts", theme: { light: "#F97316", dark: "#EA580C" } },
                      engagement: { label: "Engagement", theme: { light: "#0EA5E9", dark: "#0284C7" } },
                    }}
                  >
                    <BarChart data={platformData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="posts" fill="var(--color-posts)" />
                      <Bar yAxisId="right" dataKey="engagement" fill="var(--color-engagement)" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Audience Demographics</CardTitle>
                  <CardDescription>Age breakdown of engaged users</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ChartContainer 
                    config={{ 
                      value: { theme: { light: "#9b87f5", dark: "#7E69AB" } },
                    }}
                  >
                    <PieChart>
                      <Pie
                        data={audienceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="var(--color-value)"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      />
                      <Tooltip />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>Likes, comments, and shares over time</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ChartContainer 
                  config={{ 
                    likes: { label: "Likes", theme: { light: "#F97316", dark: "#EA580C" } },
                    comments: { label: "Comments", theme: { light: "#9b87f5", dark: "#7E69AB" } },
                    shares: { label: "Shares", theme: { light: "#0EA5E9", dark: "#0284C7" } },
                  }}
                >
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="likes" fill="var(--color-likes)" />
                    <Bar dataKey="comments" fill="var(--color-comments)" />
                    <Bar dataKey="shares" fill="var(--color-shares)" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience" className="space-y-4">
            {/* Placeholder for future audience analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Audience Demographics</CardTitle>
                <CardDescription>This section will integrate with creator platform analytics</CardDescription>
              </CardHeader>
              <CardContent className="h-96 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p className="mb-4">Full audience analytics will be available when connected to creator accounts</p>
                  <Button>Connect Creator Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            {/* Placeholder for future content performance analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
                <CardDescription>Compare performance across different content pieces</CardDescription>
              </CardHeader>
              <CardContent className="h-96 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p className="mb-4">Content performance metrics will be populated when campaign is live</p>
                  <Button>See Example Data</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </BrandLayout>
  );
};

export default CampaignAnalytics;
