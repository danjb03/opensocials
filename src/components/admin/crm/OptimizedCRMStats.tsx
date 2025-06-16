
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, TrendingUp, FileText, DollarSign, Loader } from 'lucide-react';

interface CRMStatsProps {
  totalBrands: number;
  totalCreators: number;
  activeBrands: number;
  activeCreators: number;
  activeDeals: number;
  totalRevenue: number;
  totalPricingFloors: number;
  isLoading: boolean;
}

const OptimizedCRMStats = memo(({
  totalBrands,
  totalCreators,
  activeBrands,
  activeCreators,
  activeDeals,
  totalRevenue,
  totalPricingFloors,
  isLoading
}: CRMStatsProps) => {
  const StatCard = memo(({ title, value, subtitle, icon: Icon, isLoading }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: any;
    isLoading: boolean;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? <Loader className="h-6 w-6 animate-spin" /> : value}
        </div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  ));

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
      <StatCard
        title="Total Brands"
        value={totalBrands}
        subtitle={`${activeBrands} active brand accounts`}
        icon={Building2}
        isLoading={isLoading}
      />
      <StatCard
        title="Total Creators"
        value={totalCreators}
        subtitle={`${activeCreators} active creator accounts`}
        icon={Users}
        isLoading={isLoading}
      />
      <StatCard
        title="Active Deals"
        value={activeDeals}
        subtitle="Deals in progress"
        icon={FileText}
        isLoading={isLoading}
      />
      <StatCard
        title="Total Revenue"
        value={isLoading ? 0 : `$${totalRevenue.toLocaleString()}`}
        subtitle="All time"
        icon={TrendingUp}
        isLoading={isLoading}
      />
      <StatCard
        title="Pricing Floors"
        value={totalPricingFloors}
        subtitle="Active pricing rules"
        icon={DollarSign}
        isLoading={isLoading}
      />
    </div>
  );
});

OptimizedCRMStats.displayName = 'OptimizedCRMStats';

export default OptimizedCRMStats;
