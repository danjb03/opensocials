
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Play, CheckCircle } from 'lucide-react';

interface BrandDashboardStatsProps {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
}

const BrandDashboardStats: React.FC<BrandDashboardStatsProps> = React.memo(({ 
  totalProjects, 
  activeProjects, 
  completedProjects 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-card shadow-sm hover:shadow-md transition-shadow border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-foreground">Total Projects</CardTitle>
          <FileText className="h-5 w-5 text-foreground" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-foreground">{totalProjects}</div>
          <p className="text-xs text-foreground mt-1">All campaigns</p>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-sm hover:shadow-md transition-shadow border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-foreground">Active Projects</CardTitle>
          <Play className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-foreground">{activeProjects}</div>
          <p className="text-xs text-foreground mt-1">Ready to go</p>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-sm hover:shadow-md transition-shadow border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-foreground">Completed Projects</CardTitle>
          <CheckCircle className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-foreground">{completedProjects}</div>
          <p className="text-xs text-foreground mt-1">Successfully executed</p>
        </CardContent>
      </Card>
    </div>
  );
});

BrandDashboardStats.displayName = 'BrandDashboardStats';

export default BrandDashboardStats;
