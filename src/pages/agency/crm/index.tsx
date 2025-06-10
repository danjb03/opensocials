
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Building2, Users, TrendingUp, FileText, BarChart2 } from 'lucide-react';
import { useAgencyBrands } from '@/hooks/agency/useAgencyBrands';
import { useAgencyCreators } from '@/hooks/agency/useAgencyCreators';

const AgencyCRMDashboard = () => {
  const { data: brands = [], isLoading: brandsLoading } = useAgencyBrands();
  const { data: creators = [], isLoading: creatorsLoading } = useAgencyCreators();

  // Calculate totals - in a real app this would come from deal tracking
  const totalActiveDeals = 23; // Mock data
  const totalRevenue = 24500; // Mock data

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
            <div className="text-2xl font-bold">
              {brandsLoading ? '...' : brands.length}
            </div>
            <p className="text-xs text-muted-foreground">Active brand accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managed Creators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {creatorsLoading ? '...' : creators.length}
            </div>
            <p className="text-xs text-muted-foreground">Active creator accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActiveDeals}</div>
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
              <Button asChild className="w-full" variant="outline">
                <Link to="/agency/crm/brands">View All Brands</Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link to="/agency/crm/brands/leaderboard">Brand Leaderboard</Link>
              </Button>
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
              <Button asChild className="w-full" variant="outline">
                <Link to="/agency/crm/creators">View All Creators</Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link to="/agency/crm/creators/leaderboard">Creator Leaderboard</Link>
              </Button>
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
              <Button asChild className="w-full" variant="outline">
                <Link to="/agency/crm/deals">View Deals Pipeline</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgencyCRMDashboard;
