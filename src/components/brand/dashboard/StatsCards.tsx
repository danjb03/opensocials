
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
  };
  isLoading: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading }) => {
  const statItems = [
    {
      title: 'Total Campaigns',
      value: stats.totalProjects,
      icon: BarChart3,
      description: 'All campaigns created'
    },
    {
      title: 'Active Campaigns',
      value: stats.activeProjects,
      icon: TrendingUp,
      description: 'Currently running'
    },
    {
      title: 'Completed',
      value: stats.completedProjects,
      icon: Users,
      description: 'Successfully finished'
    },
    {
      title: 'Success Rate',
      value: stats.totalProjects > 0 ? Math.round((stats.completedProjects / stats.totalProjects) * 100) : 0,
      icon: DollarSign,
      description: 'Completion percentage',
      suffix: '%'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {item.value}{item.suffix || ''}
              </div>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
