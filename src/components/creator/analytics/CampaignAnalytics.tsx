
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Deal {
  id: string;
  title?: string;
  value?: number;
  status: string;
  created_at?: string;
}

interface CampaignAnalyticsProps {
  deals: Deal[];
}

const CampaignAnalytics: React.FC<CampaignAnalyticsProps> = ({ deals }) => {
  // Group deals by status for chart
  const statusData = [
    { status: 'Pending', count: deals.filter(d => d.status === 'pending').length },
    { status: 'Active', count: deals.filter(d => d.status === 'accepted').length },
    { status: 'Completed', count: deals.filter(d => d.status === 'completed').length },
    { status: 'Declined', count: deals.filter(d => d.status === 'declined').length },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white">Campaign Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="status" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  color: '#F9FAFB'
                }} 
              />
              <Bar dataKey="count" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignAnalytics;
