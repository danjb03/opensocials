
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart, Pie, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { CalendarDays, ArrowLeft, Download, Share2, Users, Check, Repeat } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

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

// Mock creator data
const mockCreators = [
  {
    id: '1',
    name: 'Emma Johnson',
    handle: '@emmacreates',
    platform: 'Instagram',
    performance: 'high',
    engagement: '5.2%',
    reach: '87,500',
    posts: 4,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: '2',
    name: 'Alex Chen',
    handle: '@alexlifestyle',
    platform: 'TikTok',
    performance: 'medium',
    engagement: '4.7%',
    reach: '120,300',
    posts: 3,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: '3',
    name: 'Maya Patel',
    handle: '@mayavibes',
    platform: 'YouTube',
    performance: 'high',
    engagement: '6.1%',
    reach: '45,800',
    posts: 2,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150&q=80'
  }
];

const getPerformanceBadge = (performance: string) => {
  const styles = {
    high: "bg-green-100 text-green-800 hover:bg-green-200",
    medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    low: "bg-red-100 text-red-800 hover:bg-red-200"
  };
  
  return styles[performance as keyof typeof styles] || "bg-gray-100 text-gray-800";
};

const CampaignAnalytics = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rehiringCreator, setRehiringCreator] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!id) return;
        
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
        toast({
          title: 'Error',
          description: 'Could not load project details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [id, toast]);

  const handleRehire = (creatorId: string) => {
    setRehiringCreator(creatorId);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Creator Invited",
        description: "The creator has been invited to your new campaign.",
      });
      setRehiringCreator(null);
    }, 1500);
  };
  
  if (loading) {
    return (
      <BrandLayout>
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </BrandLayout>
    );
  }

  if (!project) {
    return (
      <BrandLayout>
        <div className="container mx-auto p-6 max-w-7xl">
          <Card>
            <CardContent className="flex flex-col items-center justify-center pt-6 pb-6">
              <h2 className="text-xl font-semibold mb-2">Project not found</h2>
              <p className="text-gray-500 mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
              <Button onClick={() => navigate('/brand/projects')}>
                Back to Projects
              </Button>
            </CardContent>
          </Card>
        </div>
      </BrandLayout>
    );
  }
  
  return (
    <BrandLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate(`/brand/projects/${project.id}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaign
            </Button>
            <h1 className="text-3xl font-bold">{project.name} Analytics</h1>
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
            <TabsTrigger value="creators">Campaign Creators</TabsTrigger>
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

          <TabsContent value="creators" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Creators</CardTitle>
                <CardDescription>Performance of creators who participated in this campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockCreators.map(creator => (
                    <Card key={creator.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 p-4 md:p-6 flex flex-col md:border-r">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={creator.avatar} alt={creator.name} />
                              <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{creator.name}</h3>
                              <p className="text-sm text-gray-500">{creator.handle}</p>
                              <div className="mt-1">
                                <Badge variant="outline" className="text-xs">{creator.platform}</Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <Badge className={`${getPerformanceBadge(creator.performance)} text-xs`}>
                              {creator.performance === 'high' 
                                ? 'High Performer' 
                                : creator.performance === 'medium'
                                  ? 'Average Performer'
                                  : 'Below Average'
                              }
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="md:w-2/3 p-4 md:p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Engagement</p>
                              <p className="text-xl font-medium">{creator.engagement}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Reach</p>
                              <p className="text-xl font-medium">{creator.reach}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Posts</p>
                              <p className="text-xl font-medium">{creator.posts}</p>
                            </div>
                          </div>
                          
                          <div className="mt-6">
                            <div className="flex justify-end space-x-3">
                              <Button variant="outline">
                                View Profile
                              </Button>
                              <Button 
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                onClick={() => handleRehire(creator.id)}
                                disabled={rehiringCreator === creator.id}
                              >
                                {rehiringCreator === creator.id ? (
                                  <>
                                    <span className="mr-2">Inviting...</span>
                                  </>
                                ) : (
                                  <>
                                    <Repeat className="mr-2 h-4 w-4" />
                                    Rehire Creator
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            {/* Content performance tab */}
            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
                <CardDescription>Compare performance across different content pieces</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Mock content items */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 bg-gray-100 p-4 flex items-center justify-center md:border-r">
                        <div className="aspect-video bg-gray-200 rounded flex items-center justify-center w-full max-w-xs">
                          <span className="text-gray-400">Instagram Post</span>
                        </div>
                      </div>
                      
                      <div className="md:w-2/3 p-6">
                        <div className="mb-4">
                          <h3 className="font-medium">Campaign Launch Post</h3>
                          <p className="text-sm text-gray-500 mt-1">Posted by @emmacreates on May 2nd</p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Likes</p>
                            <p className="text-xl font-medium">2,451</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Comments</p>
                            <p className="text-xl font-medium">348</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Shares</p>
                            <p className="text-xl font-medium">123</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Saves</p>
                            <p className="text-xl font-medium">287</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500">Engagement Rate</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={58} className="h-2" />
                            <span className="text-sm font-medium">5.8%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 bg-gray-100 p-4 flex items-center justify-center md:border-r">
                        <div className="aspect-video bg-gray-200 rounded flex items-center justify-center w-full max-w-xs">
                          <span className="text-gray-400">TikTok Video</span>
                        </div>
                      </div>
                      
                      <div className="md:w-2/3 p-6">
                        <div className="mb-4">
                          <h3 className="font-medium">Product Feature Video</h3>
                          <p className="text-sm text-gray-500 mt-1">Posted by @alexlifestyle on May 3rd</p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Views</p>
                            <p className="text-xl font-medium">45,287</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Likes</p>
                            <p className="text-xl font-medium">8,192</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Comments</p>
                            <p className="text-xl font-medium">1,248</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Shares</p>
                            <p className="text-xl font-medium">3,541</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500">Watch Completion</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={72} className="h-2" />
                            <span className="text-sm font-medium">72%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
