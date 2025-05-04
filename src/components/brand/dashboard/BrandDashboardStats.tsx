
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Play, CheckCircle } from 'lucide-react';

interface BrandDashboardStatsProps {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
}

const BrandDashboardStats: React.FC<BrandDashboardStatsProps> = ({ 
  totalProjects, 
  activeProjects, 
  completedProjects 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Total Projects</CardTitle>
          <FileText className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalProjects}</div>
          <p className="text-sm text-muted-foreground">All campaigns</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Active Projects</CardTitle>
          <Play className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{activeProjects}</div>
          <p className="text-sm text-muted-foreground">Ready to go</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Completed Projects</CardTitle>
          <CheckCircle className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{completedProjects}</div>
          <p className="text-sm text-muted-foreground">Successfully executed</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandDashboardStats;
