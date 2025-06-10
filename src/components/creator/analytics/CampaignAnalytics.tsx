
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Calendar } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  value: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface CampaignAnalyticsProps {
  deals: Deal[];
}

const CampaignAnalytics: React.FC<CampaignAnalyticsProps> = ({ deals }) => {
  // Group deals by month for the bar chart
  const monthlyData = React.useMemo(() => {
    const months = {};
    deals.forEach(deal => {
      const month = new Date(deal.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!months[month]) {
        months[month] = { month, count: 0, value: 0 };
      }
      months[month].count += 1;
      months[month].value += Number(deal.value);
    });
    return Object.values(months).slice(-6); // Last 6 months
  }, [deals]);

  // Status distribution for pie chart
  const statusData = React.useMemo(() => {
    const statuses = {};
    deals.forEach(deal => {
      statuses[deal.status] = (statuses[deal.status] || 0) + 1;
    });
    return Object.entries(statuses).map(([status, count]) => ({ status, count }));
  }, [deals]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-100">
          <Calendar className="h-5 w-5" />
          Campaign Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-3 text-gray-100">Monthly Campaign Activity</h4>
          {monthlyData.length > 0 ? (
            <ChartContainer
              config={{
                count: { label: "Campaigns", theme: { light: "#2563eb", dark: "#60a5fa" } }
              }}
              className="h-[200px]"
            >
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-300">
              No campaign data available
            </div>
          )}
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-gray-100">Deal Status Distribution</h4>
          {statusData.length > 0 ? (
            <div className="flex items-center justify-center">
              <ChartContainer
                config={{
                  count: { label: "Count", theme: { light: "#2563eb", dark: "#60a5fa" } }
                }}
                className="h-[200px] w-full"
              >
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ status, count }) => `${status}: ${count}`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ChartContainer>
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-300">
              No status data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignAnalytics;
