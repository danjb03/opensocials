
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, Activity, TrendingUp } from 'lucide-react';

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
  const stats = [
    {
      title: 'Total Earnings',
      value: `$${totalEarnings.toLocaleString()}`,
      description: 'All time earnings',
      icon: DollarSign,
      trend: '+12.5%',
      trendUp: true
    },
    {
      title: 'Pipeline Value',
      value: `$${pipelineValue.toLocaleString()}`,
      description: 'Potential earnings',
      icon: TrendingUp,
      trend: '+8.2%',
      trendUp: true
    },
    {
      title: 'Active Connections',
      value: connectionStats.working.toString(),
      description: 'Working relationships',
      icon: Users,
      trend: '+2',
      trendUp: true
    },
    {
      title: 'In Discussions',
      value: connectionStats.in_talks.toString(),
      description: 'Ongoing conversations',
      icon: Activity,
      trend: '+5',
      trendUp: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <Icon className="h-5 w-5 text-gray-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${
                  stat.trendUp ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend}
                </span>
                <span className="text-xs text-gray-500">
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
