
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Handshake, Target } from 'lucide-react';
import { useCreatorDealStats } from '@/hooks/useCreatorDealsSecure';

const EarningsOverview: React.FC = () => {
  const { 
    totalEarnings, 
    completedDeals, 
    activeDeals, 
    pipelineValue 
  } = useCreatorDealStats();
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
            Your total earnings
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
            Your potential earnings
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsOverview;
