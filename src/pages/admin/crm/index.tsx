
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Building2, Users, FileText, BarChart2, DollarSign } from 'lucide-react';
import AdminCRMLayout from '@/components/layouts/AdminCRMLayout';
import OptimizedCRMStats from '@/components/admin/crm/OptimizedCRMStats';
import { usePricingFloors } from '@/hooks/admin/usePricingFloors';
import { useOptimizedCRM } from '@/hooks/admin/useOptimizedCRM';

const AdminCRM = () => {
  // Use optimized CRM hook for faster loading
  const { data: crmData, isLoading: crmLoading, error: crmError } = useOptimizedCRM();
  
  // Get pricing floors data
  const { data: pricingFloors, isLoading: pricingFloorsLoading } = usePricingFloors();

  const totalPricingFloors = pricingFloors?.length || 0;
  const isLoading = crmLoading || pricingFloorsLoading;

  // Default values while loading
  const {
    totalBrands = 0,
    activeBrands = 0,
    totalCreators = 0,
    activeCreators = 0,
    activeDeals = 0,
    totalRevenue = 0,
  } = crmData || {};

  if (crmError) {
    console.error('CRM Error:', crmError);
  }

  return (
    <AdminCRMLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart2 className="h-8 w-8" />
          <h1 className="text-3xl font-bold">CRM Dashboard</h1>
        </div>
      </div>

      <OptimizedCRMStats
        totalBrands={totalBrands}
        totalCreators={totalCreators}
        activeBrands={activeBrands}
        activeCreators={activeCreators}
        activeDeals={activeDeals}
        totalRevenue={totalRevenue}
        totalPricingFloors={totalPricingFloors}
        isLoading={isLoading}
      />

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
