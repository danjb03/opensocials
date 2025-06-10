
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface EarningsChartProps {
  earningsData: {
    date: string;
    amount: number;
  }[];
}

const EarningsChart: React.FC<EarningsChartProps> = React.memo(({
  earningsData
}) => {
  const chartConfig = useMemo(() => ({
    amount: {
      label: "Earnings",
      theme: {
        light: "#2563eb",
        dark: "#60a5fa"
      }
    }
  }), []);

  const chartMargin = useMemo(() => ({
    top: 20,
    right: 30,
    left: 20,
    bottom: 20
  }), []);

  const hasData = useMemo(() => 
    earningsData && earningsData.length > 0,
    [earningsData]
  );

  if (!hasData) {
    return (
      <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-gray-100">Earnings Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-gray-300">
            Zero now. But one campaign flips this graph.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700/50">
      <CardHeader>
        <CardTitle className="text-gray-100">Earnings Over Time</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-8">
        <div className="h-[400px] w-full">
          <ChartContainer config={chartConfig}>
            <LineChart data={earningsData} margin={chartMargin}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="var(--color-amount)" 
                strokeWidth={2} 
                dot={{ r: 4 }} 
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
});

EarningsChart.displayName = 'EarningsChart';

export default EarningsChart;
