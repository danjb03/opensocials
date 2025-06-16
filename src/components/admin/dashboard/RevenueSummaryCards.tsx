
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Calendar, GitBranch } from 'lucide-react';

interface RevenueSummaryCardsProps {
  totalRevenue: number;
  totalProfit: number;
  totalTransactions: number;
  pipelineValue: number;
  pipelineCampaignsCount: number;
  selectedMonthLabel: string;
  onPipelineClick: () => void;
}

const RevenueSummaryCards = ({
  totalRevenue,
  totalProfit,
  totalTransactions,
  pipelineValue,
  pipelineCampaignsCount,
  selectedMonthLabel,
  onPipelineClick
}: RevenueSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Total Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            ${totalRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">{selectedMonthLabel}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Platform Profit (25%)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            ${totalProfit.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">{selectedMonthLabel}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {totalTransactions}
          </div>
          <p className="text-xs text-muted-foreground">{selectedMonthLabel}</p>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={onPipelineClick}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Pipeline Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            ${pipelineValue.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {pipelineCampaignsCount} draft campaigns
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueSummaryCards;
