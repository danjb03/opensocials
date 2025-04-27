
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import PendingDeals from '@/components/deals/PendingDeals';
import PastDeals from '@/components/deals/PastDeals';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CalendarDays, Clock } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  description: string | null;
  value: number;
  status: string;
  feedback: string | null;
  creator_id: string;
  brand_id: string;
  created_at: string | null;
  updated_at: string | null;
  deadline?: string | null;
  project_brief?: string | null;
  campaign_goals?: string | null;
  target_audience?: string | null;
  deliverables?: string[] | null;
  profiles: {
    company_name: string;
  };
}

const SAMPLE_DEALS: Deal[] = [
  {
    id: '1',
    title: 'Summer Fashion Campaign',
    description: 'Promote our new summer collection on your social media platforms',
    value: 2500,
    status: 'pending',
    feedback: null,
    creator_id: '1',
    brand_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    project_brief: 'Create 3 Instagram posts showcasing our summer collection in outdoor settings.',
    campaign_goals: 'Increase awareness of our new summer collection, drive traffic to our online store.',
    target_audience: 'Fashion-conscious women, 18-35 years old.',
    deliverables: ['3 Instagram posts', '2 Stories', '1 Reel'],
    profiles: {
      company_name: 'Fashion Brand Co.'
    }
  },
  {
    id: '2',
    title: 'Tech Product Review',
    description: 'Detailed review of our latest smartphone',
    value: 3000,
    status: 'pending',
    feedback: null,
    creator_id: '1',
    brand_id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    project_brief: 'Create an in-depth video review of our new smartphone highlighting key features.',
    campaign_goals: 'Generate interest in our new product launch, demonstrate features to potential buyers.',
    target_audience: 'Tech enthusiasts, 20-45 years old.',
    deliverables: ['10-minute YouTube review', 'Instagram Story highlight'],
    profiles: {
      company_name: 'TechGear Inc.'
    }
  },
  {
    id: '3',
    title: 'Fitness App Promotion',
    description: 'Create a workout video using our app',
    value: 1800,
    status: 'accepted',
    feedback: null,
    creator_id: '1',
    brand_id: '3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deadline: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    project_brief: 'Create a guided workout video that showcases our app features.',
    campaign_goals: 'Demonstrate app functionality, increase app downloads.',
    target_audience: 'Fitness enthusiasts, 18-40 years old.',
    deliverables: ['1 TikTok video', '1 Instagram video', 'App demonstration'],
    profiles: {
      company_name: 'FitLife App'
    }
  },
  {
    id: '4',
    title: 'Beauty Products Campaign',
    description: 'Skincare routine featuring our products',
    value: 2000,
    status: 'declined',
    feedback: 'Timeline conflicts with other commitments',
    creator_id: '1',
    brand_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deadline: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    project_brief: 'Create a morning skincare routine video featuring our products.',
    campaign_goals: 'Showcase product effectiveness, increase brand awareness.',
    target_audience: 'Beauty enthusiasts, 25-45 years old.',
    deliverables: ['1 YouTube video', '3 Instagram posts', 'Product review'],
    profiles: {
      company_name: 'Glow Beauty'
    }
  }
];

const dealValueData = [
  { name: 'Accepted', value: 3800, color: '#22c55e' },
  { name: 'Pending', value: 5500, color: '#f59e0b' },
  { name: 'Declined', value: 2000, color: '#ef4444' }
];

const dealTypeData = [
  { name: 'Social Media', value: 6, color: '#3b82f6' },
  { name: 'Video Content', value: 4, color: '#8b5cf6' },
  { name: 'Blog Posts', value: 2, color: '#ec4899' }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CreatorDeals = () => {
  const { user } = useAuth();

  const { data: deals = SAMPLE_DEALS } = useQuery<Deal[]>({
    queryKey: ['creator-deals', user?.id],
    queryFn: async () => {
      const { data: dealsData, error: dealsError } = await supabase
        .from('deals')
        .select(`
          *,
          profiles:brand_id(company_name)
        `)
        .eq('creator_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (dealsError) {
        console.error('Error fetching deals:', dealsError);
        throw dealsError;
      }

      return (dealsData || []).map((deal: any) => ({
        ...deal,
        profiles: {
          company_name: deal.profiles?.company_name || 'Unknown Brand'
        }
      }));
    },
    enabled: !!user?.id,
  });

  const pendingDeals = deals.filter(deal => deal.status === 'pending');
  const otherDeals = deals.filter(deal => deal.status !== 'pending');

  const totalDeals = deals.length;
  const acceptedDeals = deals.filter(deal => deal.status === 'accepted').length;
  const pendingDealsCount = pendingDeals.length;
  const declinedDeals = deals.filter(deal => deal.status === 'declined').length;
  
  const totalRevenue = deals
    .filter(deal => deal.status === 'accepted')
    .reduce((sum, deal) => sum + deal.value, 0);
    
  const potentialRevenue = pendingDeals.reduce((sum, deal) => sum + deal.value, 0);

  return (
    <CreatorLayout>
      <div className="container mx-auto p-6 space-y-8">
        {/* Analytics Overview */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Deal Summary</CardTitle>
              <CardDescription>Overview of your collaboration deals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60">
                <ChartContainer 
                  config={{
                    accepted: { color: "#22c55e" },
                    pending: { color: "#f59e0b" },
                    declined: { color: "#ef4444" }
                  }}
                >
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Accepted', value: acceptedDeals },
                        { name: 'Pending', value: pendingDealsCount },
                        { name: 'Declined', value: declinedDeals }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {[
                        { name: 'Accepted', color: "#22c55e" },
                        { name: 'Pending', color: "#f59e0b" },
                        { name: 'Declined', color: "#ef4444" }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center mt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Accepted</p>
                  <p className="font-medium">{acceptedDeals}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="font-medium">{pendingDealsCount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Declined</p>
                  <p className="font-medium">{declinedDeals}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Revenue</CardTitle>
              <CardDescription>Current and potential earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Confirmed Revenue</p>
                  <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">From {acceptedDeals} accepted deals</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Potential Revenue</p>
                  <p className="text-2xl font-bold text-muted-foreground">${potentialRevenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">From {pendingDealsCount} pending deals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Deadlines</CardTitle>
              <CardDescription>Upcoming decision deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingDeals.slice(0, 3).map(deal => {
                  const deadline = new Date(deal.deadline || Date.now());
                  const today = new Date();
                  const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={deal.id} className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        daysLeft <= 1 ? 'bg-red-100' : daysLeft <= 3 ? 'bg-amber-100' : 'bg-green-100'
                      }`}>
                        <Clock className={`h-4 w-4 ${
                          daysLeft <= 1 ? 'text-red-600' : daysLeft <= 3 ? 'text-amber-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">{deal.title}</p>
                        <p className="text-xs text-muted-foreground">{deal.profiles.company_name}</p>
                      </div>
                      <div className={`text-sm font-medium ${
                        daysLeft <= 1 ? 'text-red-600' : daysLeft <= 3 ? 'text-amber-600' : 'text-green-600'
                      }`}>
                        {daysLeft > 0 ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''}` : 'Due today'}
                      </div>
                    </div>
                  );
                })}
                
                {pendingDeals.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No pending deals with deadlines
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:sticky lg:top-6 h-fit">
            <PendingDeals deals={pendingDeals} />
          </div>
          {/* This section was previously at the bottom, now we've added it here */}
          <div className="hidden lg:block"></div>
        </div>

        {/* Past Deals now at the bottom */}
        <div>
          <PastDeals deals={otherDeals} />
        </div>
      </div>
    </CreatorLayout>
  );
};

export default CreatorDeals;

