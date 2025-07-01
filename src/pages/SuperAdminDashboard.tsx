
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';
import DashboardHeader from '@/components/admin/super-admin/DashboardHeader';
import OverviewTab from '@/components/admin/super-admin/OverviewTab';
import DashboardAccessTab from '@/components/admin/super-admin/DashboardAccessTab';
import LeaderboardTab from '@/components/admin/super-admin/LeaderboardTab';
import ToolsTab from '@/components/admin/super-admin/ToolsTab';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, role, isLoading } = useUnifiedAuth();

  console.log('🔍 SuperAdminDashboard Debug:', {
    user: !!user,
    role,
    isLoading,
    userEmail: user?.email
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Super Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading dashboard. Please try refreshing the page.</p>
          <p className="text-muted-foreground text-sm">If the problem persists, please check your authentication status.</p>
        </div>
      </div>
    );
  }

  if (role !== 'super_admin' && role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Access Denied</p>
          <p className="text-muted-foreground text-sm">You don't have permission to access this dashboard.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <DashboardHeader />
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="dashboards">Dashboard Access</TabsTrigger>
          <TabsTrigger value="leaderboard">Creator Earnings</TabsTrigger>
          <TabsTrigger value="tools">Admin Tools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="dashboards">
          <DashboardAccessTab />
        </TabsContent>
        
        <TabsContent value="leaderboard">
          <LeaderboardTab />
        </TabsContent>
        
        <TabsContent value="tools">
          <ToolsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminDashboard;
