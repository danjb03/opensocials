
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import DashboardHeader from '@/components/admin/super-admin/DashboardHeader';
import OverviewTab from '@/components/admin/super-admin/OverviewTab';
import DashboardAccessTab from '@/components/admin/super-admin/DashboardAccessTab';
import LeaderboardTab from '@/components/admin/super-admin/LeaderboardTab';
import ToolsTab from '@/components/admin/super-admin/ToolsTab';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, isLoading } = useUnifiedAuth();

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading Super Admin Dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading dashboard. Please try refreshing the page.</p>
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
