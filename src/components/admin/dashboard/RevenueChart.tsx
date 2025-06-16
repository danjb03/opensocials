
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueData {
  period: string;
  revenue: number;
  profit: number;
  transactions: number;
}

interface RevenueChartProps {
  revenueData: RevenueData[] | undefined;
  revenueLoading: boolean;
  timeFrame: string;
}

const RevenueChart = ({ revenueData, revenueLoading, timeFrame }: RevenueChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-foreground">
          Revenue Trend - {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {revenueLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                <XAxis 
                  dataKey="period" 
                  stroke="#888888"
                  tick={{ fill: '#888888' }}
                />
                <YAxis 
                  stroke="#888888"
                  tick={{ fill: '#888888' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#000000',
                    border: '1px solid #333333',
                    borderRadius: '6px',
                    color: '#ffffff'
                  }}
                  formatter={(value, name) => [
                    `$${Number(value).toLocaleString()}`,
                    name === 'revenue' ? 'Revenue' : 'Profit'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#ffffff" 
                  strokeWidth={2}
                  dot={{ fill: '#ffffff', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#888888" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#888888', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#888888', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
