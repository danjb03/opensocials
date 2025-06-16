import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Building2, Users, TrendingUp, FileText, BarChart2, Loader, DollarSign } from 'lucide-react';
import AdminCRMLayout from '@/components/layouts/AdminCRMLayout';
import { useBrandCRM } from '@/hooks/admin/useBrandCRM';
import { useCreatorCRM } from '@/hooks/admin/useCreatorCRM';
import { usePricingFloors } from '@/hooks/admin/usePricingFloors';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminCRM = () => {
  // Get real brand data
  const { brands, isLoading: brandsLoading } = useBrandCRM({ pageSize: 1000 });
  
  // Get real creator data  
  const { creators, isLoading: creatorsLoading } = useCreatorCRM({ pageSize: 1000 });

  // Get pricing floors data
  const { data: pricingFloors, isLoading: pricingFloorsLoading } = usePricingFloors();

  // Get real deals data
  const { data: dealsData, isLoading: dealsLoading } = useQuery({
    queryKey: ['admin-deals-summary'],
    queryFn: async () => {
      const { data: deals, error } = await supabase
        .from('deals')
        .select('id, status, value')
        .in('status', ['active', 'accepted', 'pending']);

      if (error) throw error;

      const activeDeals = deals?.filter(deal => deal.status === 'active' || deal.status === 'accepted').length || 0;
      const totalRevenue = deals?.reduce((sum, deal) => sum + (deal.value || 0), 0) || 0;

      return { activeDeals, totalRevenue };
    }
  });

  // Calculate real statistics
  const totalBrands = brands.length;
  const totalCreators = creators.length;
  const activeBrands = brands.filter(b => b.status === 'active').length;
  const activeCreators = creators.filter(c => c.status === 'active').length;
  const activeDeals = dealsData?.activeDeals || 0;
  const totalRevenue = dealsData?.totalRevenue || 0;
  const totalPricingFloors = pricingFloors?.length || 0;

  const isLoading = brandsLoading || creatorsLoading || dealsLoading || pricingFloorsLoading;

  return (
    <AdminCRMLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart2 className="h-8 w-8" />
          <h1 className="text-3xl font-bold">CRM Dashboard</h1>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader className="h-6 w-6 animate-spin" /> : totalBrands}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeBrands} active brand accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Creators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader className="h-6 w-6 animate-spin" /> : totalCreators}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeCreators} active creator accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader className="h-6 w-6 animate-spin" /> : activeDeals}
            </div>
            <p className="text-xs text-muted-foreground">Deals in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader className="h-6 w-6 animate-spin" /> : `$${totalRevenue.toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pricing Floors</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader className="h-6 w-6 animate-spin" /> : totalPricingFloors}
            </div>
            <p className="text-xs text-muted-foreground">Active pricing rules</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Brand Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage brand accounts, view their campaigns, and track performance metrics.
            </p>
            <div className="space-y-2">
              <Link to="/admin/crm/brands" className="block">
                <Button variant="outline" className="w-full">
                  View All Brands
                </Button>
              </Link>
              <Link to="/admin/crm/brands/leaderboard" className="block">
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
              Manage creator accounts, track their performance, and analyze engagement metrics.
            </p>
            <div className="space-y-2">
              <Link to="/admin/crm/creators" className="block">
                <Button variant="outline" className="w-full">
                  View All Creators
                </Button>
              </Link>
              <Link to="/admin/crm/creators/leaderboard" className="block">
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
              Track active deals, manage negotiations, and monitor contract status.
            </p>
            <div className="space-y-2">
              <Link to="/admin/crm/deals" className="block">
                <Button variant="outline" className="w-full">
                  View Deals Pipeline
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Configure minimum pricing floors for different creator tiers and campaign types.
            </p>
            <div className="space-y-2">
              <Link to="/admin/pricing-floors" className="block">
                <Button variant="outline" className="w-full">
                  Manage Pricing Floors
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminCRMLayout>
  );
};

export default AdminCRM;
