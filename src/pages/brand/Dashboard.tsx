
import React from 'react';
import DashboardHeader from '@/components/brand/dashboard/DashboardHeader';
import StatsCards from '@/components/brand/dashboard/StatsCards';
import TodoPanel from '@/components/brand/dashboard/TodoPanel';
import RecentProjects from '@/components/brand/dashboard/RecentProjects';
import QuickActions from '@/components/brand/dashboard/QuickActions';
import { useBrandDashboard } from '@/hooks/useBrandDashboard';

const BrandDashboard = () => {
  const {
    isLoading,
    projects,
    todoItems,
    projectStats
  } = useBrandDashboard();

  const handleMarkTodoComplete = (todoId: string) => {
    console.log('Marking todo as complete:', todoId);
    // Todo: Implement todo completion logic
  };

  const handleViewAllTodos = () => {
    console.log('Viewing all todos');
    // Todo: Navigate to todos page or expand panel
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <DashboardHeader />
      
      <StatsCards 
        stats={projectStats}
        isLoading={isLoading}
      />

      {/* Quick Actions - Full Width Below Stats with subtle blue accent */}
      <div className="w-full">
        <div className="bg-gradient-to-r from-blue-50/50 to-slate-50 rounded-lg p-4 border border-blue-100/50">
          <QuickActions />
        </div>
      </div>

      {/* Recent Campaigns - Full Width with subtle blue border */}
      <div className="w-full">
        <div className="bg-white rounded-lg border border-blue-100/30 shadow-sm">
          <RecentProjects 
            projects={projects}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Action Items - Full Width Below Recent Campaigns with blue accent */}
      <div className="w-full">
        <div className="bg-gradient-to-r from-slate-50 to-blue-50/40 rounded-lg border border-blue-100/40">
          <TodoPanel 
            todos={todoItems}
            onMarkComplete={handleMarkTodoComplete}
            onViewAll={handleViewAllTodos}
          />
        </div>
      </div>
    </div>
  );
};

export default BrandDashboard;
