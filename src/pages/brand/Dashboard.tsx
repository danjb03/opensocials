
import { useState } from 'react';
import BrandLayout from '@/components/layouts/BrandLayout';
import BrandDashboardStats from '@/components/brand/dashboard/BrandDashboardStats';
import TodoPanel from '@/components/brand/dashboard/TodoPanel';
import CreatorList from '@/components/brand/dashboard/CreatorList';
import QuickActions from '@/components/brand/dashboard/QuickActions';
import { useBrandDashboard } from '@/hooks/useBrandDashboard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    isLoading,
    projectStats,
    todoItems,
    creators
  } = useBrandDashboard();

  const handleBackToSuperAdmin = () => {
    navigate('/super-admin');
  };

  return (
    <BrandLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Brand Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={handleBackToSuperAdmin} 
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Super Admin
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <QuickActions />
            
            <BrandDashboardStats 
              totalProjects={projectStats.totalProjects}
              activeProjects={projectStats.activeProjects}
              completedProjects={projectStats.completedProjects}
            />
            
            <div className="mb-6">
              <TodoPanel items={todoItems} />
            </div>
            
            <CreatorList creators={creators} />
          </>
        )}
      </div>
    </BrandLayout>
  );
};

export default Dashboard;
