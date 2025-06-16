import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, TrendingUp, DollarSign, GitBranch } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [showPipelineDetails, setShowPipelineDetails] = useState(false);

  // Generate month options for the dropdown
  const generateMonthOptions = () => {
    const options = [];
    const now = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      options.push({ value, label });
    }
    
    return options;
  };

  const monthOptions = generateMonthOptions();

  // Mock revenue data - in production this would come from your analytics system
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['admin-revenue', timeFrame, selectedMonth],
    queryFn: async (): Promise<RevenueData[]> => {
      // Mock data for demonstration
      const mockData: RevenueData[] = [];
      const [year, month] = selectedMonth.split('-').map(Number);
      
      if (timeFrame === 'monthly') {
        // Generate data for the last 12 months
        for (let i = 11; i >= 0; i--) {
          const date = new Date(year, month - 1 - i, 1);
          const revenue = Math.floor(Math.random() * 50000) + 10000;
          mockData.push({
            period: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            revenue,
            profit: revenue * 0.25, // 25% margin
            transactions: Math.floor(Math.random() * 50) + 10
          });
        }
      } else if (timeFrame === 'weekly') {
        // Generate data for weeks in the selected month
        const daysInMonth = new Date(year, month, 0).getDate();
        for (let week = 1; week <= 4; week++) {
          const revenue = Math.floor(Math.random() * 15000) + 3000;
          mockData.push({
            period: `Week ${week}`,
            revenue,
            profit: revenue * 0.25,
            transactions: Math.floor(Math.random() * 15) + 3
          });
        }
      } else {
        // Generate data for days in the selected month
        const daysInMonth = new Date(year, month, 0).getDate();
        const sampleDays = Math.min(7, daysInMonth); // Show last 7 days
        for (let i = sampleDays - 1; i >= 0; i--) {
          const date = new Date(year, month - 1, daysInMonth - i);
          const revenue = Math.floor(Math.random() * 5000) + 1000;
          mockData.push({
            period: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            revenue,
            profit: revenue * 0.25,
            transactions: Math.floor(Math.random() * 8) + 1
          });
        }
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

  const getSelectedMonthLabel = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
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
          
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
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
            <p className="text-xs text-muted-foreground">{getSelectedMonthLabel()}</p>
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
            <p className="text-xs text-muted-foreground">{getSelectedMonthLabel()}</p>
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
            <p className="text-xs text-muted-foreground">{getSelectedMonthLabel()}</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setShowPipelineDetails(!showPipelineDetails)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
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

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Revenue Trend - {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {revenueLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                  <XAxis 
                    dataKey="period" 
                    stroke="#888888"
                    tick={{ fill: '#888888' }}
                  />
                  <YAxis 
                    stroke="#888888"
                    tick={{ fill: '#888888' }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#000000',
                      border: '1px solid #333333',
                      borderRadius: '6px',
                      color: '#ffffff'
                    }}
                    formatter={(value, name) => [
                      `$${Number(value).toLocaleString()}`,
                      name === 'revenue' ? 'Revenue' : 'Profit'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#ffffff" 
                    strokeWidth={2}
                    dot={{ fill: '#ffffff', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#888888" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#888888', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#888888', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueAnalytics;
