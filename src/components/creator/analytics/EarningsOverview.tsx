
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Handshake, Target } from 'lucide-react';

interface EarningsOverviewProps {
  totalEarnings: number;
  completedDeals: number;
  activeDeals: number;
  pipelineValue: number;
}

const EarningsOverview: React.FC<EarningsOverviewProps> = ({
  totalEarnings,
  completedDeals,
  activeDeals,
  pipelineValue
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalEarnings.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Lifetime earnings
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Deals</CardTitle>
          <Handshake className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedDeals}</div>
          <p className="text-xs text-muted-foreground">
            Successfully delivered
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeDeals}</div>
          <p className="text-xs text-muted-foreground">
            Currently working on
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${pipelineValue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Potential earnings
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsOverview;
