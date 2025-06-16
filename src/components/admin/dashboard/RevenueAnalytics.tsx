
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
      
      // Query deal_earnings directly for real revenue data
      let startDate: Date;
      let endDate: Date;
      
      if (timeFrame === 'monthly') {
        // Get past 12 months
        startDate = new Date(year - 1, month - 1, 1);
        endDate = new Date(year, month, 1);
      } else if (timeFrame === 'weekly') {
        // Get weeks in selected month
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 1);
      } else {
        // Get days in selected month
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 1);
      }

      const { data: earnings, error } = await supabase
        .from('deal_earnings')
        .select('amount, earned_at')
        .gte('earned_at', startDate.toISOString())
        .lt('earned_at', endDate.toISOString())
        .order('earned_at', { ascending: true });

      if (error) {
        console.error('Error fetching earnings:', error);
        return [];
      }

      // Group earnings by time period
      const groupedData: { [key: string]: { revenue: number; count: number } } = {};
      
      earnings?.forEach(earning => {
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
