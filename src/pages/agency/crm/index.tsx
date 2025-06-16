
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Building2, Users, TrendingUp, FileText, BarChart2 } from 'lucide-react';
import { useAgencyBrands } from '@/hooks/agency/useAgencyBrands';
import { useAgencyCreators } from '@/hooks/agency/useAgencyCreators';

const AgencyCRMDashboard = () => {
  const { data: brands = [] } = useAgencyBrands();
  const { data: creators = [] } = useAgencyCreators();

  const activeBrands = brands.filter(b => b.status === 'active').length;
  const activeCreators = creators.filter(c => c.status === 'active').length;
  const totalReach = creators.reduce((sum, creator) => sum + (creator.follower_count || 0), 0);

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
            <div className="text-2xl font-bold">{brands.length}</div>
            <p className="text-xs text-muted-foreground">Under your management</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managed Creators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creators.length}</div>
            <p className="text-xs text-muted-foreground">Under your management</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBrands + activeCreators}</div>
            <p className="text-xs text-muted-foreground">Active brands & creators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReach.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Combined followers</p>
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
                  View All Brands ({brands.length})
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
                  View All Creators ({creators.length})
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
              Account Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Overview of all accounts under your management and their status.
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Brands:</span>
                <span className="font-semibold">{activeBrands}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Creators:</span>
                <span className="font-semibold">{activeCreators}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Reach:</span>
                <span className="font-semibold">{totalReach.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgencyCRMDashboard;
