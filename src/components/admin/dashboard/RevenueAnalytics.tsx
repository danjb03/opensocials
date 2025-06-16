
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, TrendingUp, DollarSign, Pipeline } from 'lucide-react';

interface RevenueData {
  period: string;
  revenue: number;
  profit: number;
  transactions: number;
}

interface PipelineCampaign {
  id: string;
  name: string;
  brand_name: string;
  budget: number;
  status: string;
  created_at: string;
}

const RevenueAnalytics = () => {
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [periodOffset, setPeriodOffset] = useState(0); // 0 = current, 1 = last, 2 = before that
  const [showPipelineDetails, setShowPipelineDetails] = useState(false);

  // Mock revenue data - in production this would come from your analytics system
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['admin-revenue', timeFrame, periodOffset],
    queryFn: async (): Promise<RevenueData[]> => {
      // Mock data for demonstration
      const mockData: RevenueData[] = [];
      const now = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        if (timeFrame === 'daily') {
          date.setDate(date.getDate() - i - (periodOffset * 7));
        } else if (timeFrame === 'weekly') {
          date.setDate(date.getDate() - (i * 7) - (periodOffset * 7 * 7));
        } else {
          date.setMonth(date.getMonth() - i - (periodOffset * 7));
        }
        
        const revenue = Math.floor(Math.random() * 50000) + 10000;
        mockData.push({
          period: date.toLocaleDateString(),
          revenue,
          profit: revenue * 0.25, // 25% margin
          transactions: Math.floor(Math.random() * 50) + 10
        });
      }
      
      return mockData;
    },
  });

  // Fetch pipeline campaigns (draft status awaiting payment)
  const { data: pipelineCampaigns, isLoading: pipelineLoading } = useQuery({
    queryKey: ['admin-pipeline-campaigns'],
    queryFn: async (): Promise<PipelineCampaign[]> => {
      const { data, error } = await supabase
        .from('projects_new')
        .select(`
          id,
          name,
          budget,
          status,
          created_at,
          brand_id
        `)
        .eq('status', 'draft')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch brand names
      const campaignsWithBrands = await Promise.all(
        (data || []).map(async (campaign) => {
          const { data: brandProfile } = await supabase
            .from('brand_profiles')
            .select('company_name')
            .eq('user_id', campaign.brand_id)
            .single();

          return {
            ...campaign,
            brand_name: brandProfile?.company_name || 'Unknown Brand'
          };
        })
      );

      return campaignsWithBrands;
    },
  });

  const totalRevenue = revenueData?.reduce((sum, item) => sum + item.revenue, 0) || 0;
  const totalProfit = revenueData?.reduce((sum, item) => sum + item.profit, 0) || 0;
  const totalTransactions = revenueData?.reduce((sum, item) => sum + item.transactions, 0) || 0;
  const pipelineValue = pipelineCampaigns?.reduce((sum, campaign) => sum + (campaign.budget || 0), 0) || 0;

  const getPeriodLabel = () => {
    const labels = ['Current', 'Last', 'Previous'];
    const periods = {
      daily: 'Week',
      weekly: 'Month', 
      monthly: 'Period'
    };
    return `${labels[periodOffset] || 'Previous'} ${periods[timeFrame]}`;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Revenue Analytics</h2>
        <div className="flex gap-4">
          <Select value={timeFrame} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setTimeFrame(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={periodOffset.toString()} onValueChange={(value) => setPeriodOffset(parseInt(value))}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Current Period</SelectItem>
              <SelectItem value="1">Last Period</SelectItem>
              <SelectItem value="2">2 Periods Ago</SelectItem>
              <SelectItem value="3">3 Periods Ago</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">{getPeriodLabel()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Platform Profit (25%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${totalProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">{getPeriodLabel()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {totalTransactions}
            </div>
            <p className="text-xs text-muted-foreground">{getPeriodLabel()}</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setShowPipelineDetails(!showPipelineDetails)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
              <Pipeline className="h-4 w-4" />
              Pipeline Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${pipelineValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {pipelineCampaigns?.length || 0} draft campaigns
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Details */}
      {showPipelineDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Pipeline Campaigns</CardTitle>
            <p className="text-sm text-muted-foreground">
              Draft campaigns awaiting completion and payment
            </p>
          </CardHeader>
          <CardContent>
            {pipelineLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : pipelineCampaigns && pipelineCampaigns.length > 0 ? (
              <div className="space-y-3">
                {pipelineCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{campaign.name}</h4>
                      <p className="text-sm text-muted-foreground">{campaign.brand_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(campaign.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">
                        ${(campaign.budget || 0).toLocaleString()}
                      </div>
                      <Badge variant="secondary">Draft</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No pipeline campaigns found
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Revenue Trend - {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)}</CardTitle>
        </CardHeader>
        <CardContent>
          {revenueLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {revenueData?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded">
                  <span className="text-sm text-foreground">{item.period}</span>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">${item.revenue.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      Profit: ${item.profit.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueAnalytics;
