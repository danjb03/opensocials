
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Building2, Users, TrendingUp, FileText, BarChart2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AgencyCRMDashboard = () => {
  const { data: brandCount = 0 } = useQuery({
    queryKey: ['agency-brand-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('brand_profiles')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: creatorCount = 0 } = useQuery({
    queryKey: ['agency-creator-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('creator_profiles')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: activeDeals = 0 } = useQuery({
    queryKey: ['agency-active-deals'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('creator_deals')
        .select('*', { count: 'exact', head: true })
        .in('status', ['active', 'accepted']);
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: totalRevenue = 0 } = useQuery({
    queryKey: ['agency-revenue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deal_earnings')
        .select('amount')
        .gte('earned_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());
      
      if (error) throw error;
      return data?.reduce((sum, earning) => sum + (earning.amount || 0), 0) || 0;
    },
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart2 className="h-8 w-8" />
          <h1 className="text-3xl font-bold">CRM Dashboard</h1>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managed Brands</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{brandCount}</div>
            <p className="text-xs text-muted-foreground">Active brand accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managed Creators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creatorCount}</div>
            <p className="text-xs text-muted-foreground">Active creator accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeals}</div>
            <p className="text-xs text-muted-foreground">Deals in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Brand Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your brand clients, view their campaigns, and track performance.
            </p>
            <div className="space-y-2">
              <Link to="/agency/crm/brands" className="block">
                <Button variant="outline" className="w-full">
                  View All Brands
                </Button>
              </Link>
              <Link to="/agency/crm/brands/leaderboard" className="block">
                <Button variant="outline" className="w-full">
                  Brand Leaderboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Creator Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your creator network, track their performance, and analyze metrics.
            </p>
            <div className="space-y-2">
              <Link to="/agency/crm/creators" className="block">
                <Button variant="outline" className="w-full">
                  View All Creators
                </Button>
              </Link>
              <Link to="/agency/crm/creators/leaderboard" className="block">
                <Button variant="outline" className="w-full">
                  Creator Leaderboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Deals Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Track deals, manage negotiations, and monitor contract status.
            </p>
            <div className="space-y-2">
              <Link to="/agency/crm/deals" className="block">
                <Button variant="outline" className="w-full">
                  View Deals Pipeline
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgencyCRMDashboard;
