
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Building2, Users, TrendingUp, FileText, BarChart2 } from 'lucide-react';
import AdminCRMLayout from '@/components/layouts/AdminCRMLayout';

const AdminCRM = () => {
  // Mock data - in a real app this would come from the CRM hooks
  const totalBrands = 156;
  const totalCreators = 892;
  const activeDeals = 47;
  const totalRevenue = 124500;

  return (
    <AdminCRMLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart2 className="h-8 w-8" />
          <h1 className="text-3xl font-bold">CRM Dashboard</h1>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBrands}</div>
            <p className="text-xs text-muted-foreground">Active brand accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Creators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCreators}</div>
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
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
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
      </div>
    </AdminCRMLayout>
  );
};

export default AdminCRM;
