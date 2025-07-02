
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SocialGrowth: React.FC = () => {
  // Mock data for social growth - in a real app this would come from props or API
  const growthData = [
    { month: 'Jan', followers: 1200 },
    { month: 'Feb', followers: 1350 },
    { month: 'Mar', followers: 1500 },
    { month: 'Apr', followers: 1650 },
    { month: 'May', followers: 1800 },
    { month: 'Jun', followers: 2000 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white">Social Media Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  color: '#F9FAFB'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="followers" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialGrowth;
