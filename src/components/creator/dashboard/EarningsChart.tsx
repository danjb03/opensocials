
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface EarningsChartProps {
  earningsData: {
    date: string;
    amount: number;
  }[];
}

const EarningsChart: React.FC<EarningsChartProps> = ({ earningsData }) => {
  if (!earningsData || earningsData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Earnings Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No earnings data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Earnings Over Time</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-8">
        <div className="h-[400px] w-full">
          <ChartContainer
            config={{
              amount: { label: "Earnings", theme: { light: "#2563eb", dark: "#1e40af" } }
            }}
          >
            <LineChart 
              data={earningsData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="amount" stroke="var(--color-amount)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EarningsChart;
