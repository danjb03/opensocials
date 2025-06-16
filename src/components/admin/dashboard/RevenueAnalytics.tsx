
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import RevenueControls from './RevenueControls';
import RevenueSummaryCards from './RevenueSummaryCards';
import PipelineDetails from './PipelineDetails';
import RevenueChart from './RevenueChart';

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

  // Real revenue data from deal_earnings table
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['admin-revenue', timeFrame, selectedMonth],
    queryFn: async (): Promise<RevenueData[]> => {
      const [year, month] = selectedMonth.split('-').map(Number);
      
      let dateFormat = '';
      let groupBy = '';
      let orderBy = '';
      
      if (timeFrame === 'monthly') {
        // Group by month
        dateFormat = "to_char(earned_at, 'Mon YYYY')";
        groupBy = "date_trunc('month', earned_at)";
        orderBy = "date_trunc('month', earned_at)";
      } else if (timeFrame === 'weekly') {
        // Group by week for the selected month
        dateFormat = "'Week ' || extract(week from earned_at)::text";
        groupBy = "date_trunc('week', earned_at)";
        orderBy = "date_trunc('week', earned_at)";
      } else {
        // Group by day for the selected month
        dateFormat = "to_char(earned_at, 'Mon DD')";
        groupBy = "date_trunc('day', earned_at)";
        orderBy = "date_trunc('day', earned_at)";
      }

      const { data, error } = await supabase.rpc('get_revenue_analytics', {
        time_frame: timeFrame,
        selected_year: year,
        selected_month: month
      });

      if (error) {
        console.error('Error fetching revenue data:', error);
        // Fallback to basic query if RPC fails
        const { data: basicData, error: basicError } = await supabase
          .from('deal_earnings')
          .select('amount, earned_at')
          .gte('earned_at', new Date(year, month - 1, 1).toISOString())
          .lt('earned_at', new Date(year, month, 1).toISOString());

        if (basicError) throw basicError;

        // Process basic data
        const groupedData: { [key: string]: { revenue: number; count: number } } = {};
        
        basicData?.forEach(earning => {
          const date = new Date(earning.earned_at);
          let key = '';
          
          if (timeFrame === 'monthly') {
            key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          } else if (timeFrame === 'weekly') {
            const weekNum = Math.ceil(date.getDate() / 7);
            key = `Week ${weekNum}`;
          } else {
            key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }
          
          if (!groupedData[key]) {
            groupedData[key] = { revenue: 0, count: 0 };
          }
          groupedData[key].revenue += earning.amount || 0;
          groupedData[key].count++;
        });

        return Object.entries(groupedData).map(([period, data]) => ({
          period,
          revenue: data.revenue,
          profit: data.revenue * 0.25, // 25% platform margin
          transactions: data.count
        }));
      }

      return data || [];
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
      <RevenueControls
        timeFrame={timeFrame}
        setTimeFrame={setTimeFrame}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />

      <RevenueSummaryCards
        totalRevenue={totalRevenue}
        totalProfit={totalProfit}
        totalTransactions={totalTransactions}
        pipelineValue={pipelineValue}
        pipelineCampaignsCount={pipelineCampaigns?.length || 0}
        selectedMonthLabel={getSelectedMonthLabel()}
        onPipelineClick={() => setShowPipelineDetails(!showPipelineDetails)}
      />

      <PipelineDetails
        showPipelineDetails={showPipelineDetails}
        pipelineCampaigns={pipelineCampaigns}
        pipelineLoading={pipelineLoading}
      />

      <RevenueChart
        revenueData={revenueData}
        revenueLoading={revenueLoading}
        timeFrame={timeFrame}
      />
    </div>
  );
};

export default RevenueAnalytics;
