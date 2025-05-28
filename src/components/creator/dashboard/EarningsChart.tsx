
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EarningsData {
  date: string;
  amount: number;
}

interface EarningsChartProps {
  earningsData: EarningsData[];
}

const EarningsChart: React.FC<EarningsChartProps> = ({ earningsData }) => {
  const hasData = earningsData && earningsData.length > 0;

  const mockData = [
    { date: 'Jan', amount: 1200 },
    { date: 'Feb', amount: 1800 },
    { date: 'Mar', amount: 2200 },
    { date: 'Apr', amount: 1900 },
    { date: 'May', amount: 2800 },
    { date: 'Jun', amount: 3200 }
  ];

  const chartData = hasData ? earningsData : mockData;

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Earnings Overview
        </CardTitle>
        <CardDescription className="text-gray-500">
          Your monthly earnings performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                📊
              </div>
              <p className="font-medium">No earnings data yet</p>
              <p className="text-sm text-gray-400">
                Complete your first campaign to see earnings
              </p>
            </div>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`$${value}`, 'Earnings']}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#000000" 
                  strokeWidth={2}
                  dot={{ fill: '#000000', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, stroke: '#000000', strokeWidth: 2, fill: 'white' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EarningsChart;
