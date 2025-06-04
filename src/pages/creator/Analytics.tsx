
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import PerformanceMetrics from '@/components/creator/analytics/PerformanceMetrics';
import CampaignAnalytics from '@/components/creator/analytics/CampaignAnalytics';
import SocialGrowth from '@/components/creator/analytics/SocialGrowth';
import EarningsChart from '@/components/creator/dashboard/EarningsChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CreatorAnalytics = () => {
  const { user } = useUnifiedAuth();
  
  const { data: earnings, isLoading: earningsLoading } = useQuery({
    queryKey: ['creator-earnings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deal_earnings')
        .select('amount, earned_at')
        .eq('creator_id', user?.id)
        .order('earned_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const { data: deals, isLoading: dealsLoading } = useQuery({
    queryKey: ['creator-deals-analytics', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('id, title, value, status, created_at, updated_at')
        .eq('creator_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const { data: connections, isLoading: connectionsLoading } = useQuery({
    queryKey: ['creator-brand-connections', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brand_creator_connections')
        .select('id, status, created_at, updated_at')
        .eq('creator_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const isLoading = earningsLoading || dealsLoading || connectionsLoading;

  const totalEarnings = earnings?.reduce((sum, earning) => sum + Number(earning.amount), 0) || 0;
  const completedDeals = deals?.filter(deal => deal.status === 'completed').length || 0;
  const activeDeals = deals?.filter(deal => deal.status === 'accepted').length || 0;
  const pipelineValue = deals?.filter(deal => deal.status === 'pending').reduce((sum, deal) => sum + Number(deal.value), 0) || 0;

  const earningsData = earnings?.map(earning => ({
    date: new Date(earning.earned_at).toLocaleDateString(),
    amount: Number(earning.amount)
  })) || [];

  if (isLoading) {
    return (
      <CreatorLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading your analytics...</p>
            </div>
          </div>
        </div>
      </CreatorLayout>
    );
  }

  return (
    <CreatorLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Creator Analytics</h1>
          <p className="text-muted-foreground">Track your earnings, performance, and growth across all brand campaigns.</p>
        </div>

        {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedDeals}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeDeals}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${pipelineValue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EarningsChart earningsData={earningsData} />
          <PerformanceMetrics deals={deals || []} connections={connections || []} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CampaignAnalytics deals={deals || []} />
          <SocialGrowth />
        </div>
      </div>
    </CreatorLayout>
  );
};

export default CreatorAnalytics;
