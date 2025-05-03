
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Users } from 'lucide-react';

interface DashboardStatsProps {
  totalEarnings: number;
  pipelineValue: number;
  connectionStats: {
    outreach: number;
    in_talks: number;
    working: number;
  };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  totalEarnings, 
  pipelineValue, 
  connectionStats 
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Total Earnings</CardTitle>
          <DollarSign className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${totalEarnings.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Lifetime earnings</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Pipeline Value</CardTitle>
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${pipelineValue.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">In pending deals</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Brand Connections</CardTitle>
          <Users className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{
            connectionStats.outreach + connectionStats.in_talks + connectionStats.working
          }</div>
          <p className="text-sm text-muted-foreground">
            {connectionStats.working} active collaborations
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
