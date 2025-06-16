
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
