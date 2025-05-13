
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import PendingDeals from '@/components/deals/PendingDeals';
import PastDeals from '@/components/deals/PastDeals';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { DollarSign, ChartPie, TrendingUp } from 'lucide-react';

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
    logo_url?: string;
  };
}

const CreatorDeals = () => {
  const { user } = useAuth();

  const { data: deals = [], isLoading } = useQuery<Deal[]>({
    queryKey: ['creator-deals', user?.id],
    queryFn: async () => {
      const { data: dealsData, error: dealsError } = await supabase
        .from('deals')
        .select(`
          *,
          profiles:brand_id(company_name, logo_url)
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
          company_name: deal.profiles?.company_name || 'Unknown Brand',
          logo_url: deal.profiles?.logo_url || null
        }
      }));
    },
    enabled: !!user?.id,
  });

  const pendingDeals = deals.filter(deal => deal.status === 'pending');
  const otherDeals = deals.filter(deal => deal.status !== 'pending');

  const acceptedDeals = deals.filter(deal => deal.status === 'accepted');
  const declinedDeals = deals.filter(deal => deal.status === 'declined');
  
  const totalRevenue = acceptedDeals.reduce((sum, deal) => sum + deal.value, 0);
  const potentialRevenue = pendingDeals.reduce((sum, deal) => sum + deal.value, 0);
  
  const dealStatusData = [
    { name: 'Accepted', value: acceptedDeals.length, color: '#22c55e' },
    { name: 'Pending', value: pendingDeals.length, color: '#f59e0b' },
    { name: 'Declined', value: declinedDeals.length, color: '#ef4444' }
  ].filter(item => item.value > 0);

  return (
    <CreatorLayout>
      <div className="container mx-auto p-6 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Deal Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your brand collaboration offers</p>
        </header>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {/* Revenue Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <h2 className="text-2xl font-bold">${totalRevenue.toLocaleString()}</h2>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="font-medium text-sm">${potentialRevenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Deals</p>
                    <p className="font-medium text-sm">{acceptedDeals.length} accepted</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Deal Status Chart */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <ChartPie className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Deal Status</p>
                  <h2 className="text-lg font-bold">{deals.length} total offers</h2>
                </div>
              </div>
              
              <div className="h-[140px] mt-2">
                {dealStatusData.length > 0 ? (
                  <ChartContainer 
                    config={{
                      accepted: { color: "#22c55e" },
                      pending: { color: "#f59e0b" },
                      declined: { color: "#ef4444" }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dealStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={60}
                          dataKey="value"
                        >
                          {dealStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    No deal data to display
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Offer Stats */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-purple-100 p-3 rounded-full">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Offer Stats</p>
                  <h2 className="text-lg font-bold">Performance</h2>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 rounded-md p-3">
                    <p className="text-xs text-muted-foreground">Acceptance Rate</p>
                    <p className="text-lg font-bold">
                      {deals.length ? 
                        Math.round((acceptedDeals.length / deals.length) * 100) + '%' : 
                        'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-md p-3">
                    <p className="text-xs text-muted-foreground">Avg. Offer Value</p>
                    <p className="text-lg font-bold">
                      ${deals.length ? 
                        Math.round(deals.reduce((sum, deal) => sum + deal.value, 0) / deals.length).toLocaleString() : 
                        '0'}
                    </p>
                  </div>
                </div>
                <div className="text-center text-xs text-muted-foreground">
                  {pendingDeals.length > 0 ? (
                    <p>You have {pendingDeals.length} pending offer{pendingDeals.length > 1 ? 's' : ''} to review</p>
                  ) : (
                    <p>No pending offers at the moment</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <PendingDeals deals={pendingDeals} />
          <PastDeals deals={otherDeals} />
        </div>
      </div>
    </CreatorLayout>
  );
};

export default CreatorDeals;
