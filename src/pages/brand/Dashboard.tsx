
import React from 'react';
import { useBrandDashboard } from '@/hooks/useBrandDashboard';
import BrandLayout from '@/components/layouts/BrandLayout';
import DashboardHeader from '@/components/brand/dashboard/DashboardHeader';
import StatsCards from '@/components/brand/dashboard/StatsCards';
import QuickActions from '@/components/brand/dashboard/QuickActions';
import RecentProjects from '@/components/brand/dashboard/RecentProjects';
import TodoPanel from '@/components/brand/dashboard/TodoPanel';
import LoadingSpinner from '@/components/ui/loading-spinner';

const BrandDashboard = () => {
  const { data: dashboardData, isLoading, error } = useBrandDashboard();

  if (isLoading) {
    return (
      <BrandLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </BrandLayout>
    );
  }

  if (error) {
    return (
      <BrandLayout>
        <div className="container mx-auto p-6">
          <div className="text-center text-red-500">
            Error loading dashboard data
          </div>
        </div>
      </BrandLayout>
    );
  }

  const { projects, todoItems, projectStats } = dashboardData || {
    projects: [],
    todoItems: [],
    projectStats: {
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      totalSpend: 0
    }
  };

  return (
    <BrandLayout>
      <div className="container mx-auto p-6 space-y-6">
        <DashboardHeader />
        <StatsCards stats={projectStats} isLoading={isLoading} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <QuickActions />
            <RecentProjects projects={projects} isLoading={isLoading} />
          </div>
          
          <div className="space-y-6">
            <TodoPanel todos={todoItems} />
          </div>
        </div>
      </div>
    </BrandLayout>
  );
};

export default BrandDashboard;
