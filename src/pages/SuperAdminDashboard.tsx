
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserRoleFixer from '@/components/admin/UserRoleFixer';
import { CreatorLeaderboard } from '@/components/admin/CreatorLeaderboard';
import { Users, User, Settings, Briefcase } from 'lucide-react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { user, role, isLoading } = useUnifiedAuth();

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
      <div>
        <h1 className="text-3xl font-light text-foreground mb-2">Super Admin Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Logged in as: {user?.email} | Role: {role || 'Unknown'}
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="dashboards">Dashboard Access</TabsTrigger>
          <TabsTrigger value="leaderboard">Creator Earnings</TabsTrigger>
          <TabsTrigger value="tools">Admin Tools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Agencies</CardTitle>
                <CardDescription className="text-muted-foreground">Manage all agency accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/super-admin/users/agencies')} 
                  className="w-full"
                >
                  View All Agencies
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Brands</CardTitle>
                <CardDescription className="text-muted-foreground">Manage brand accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/super-admin/users/brands')} 
                  className="w-full"
                >
                  View All Brands
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Creators</CardTitle>
                <CardDescription className="text-muted-foreground">Manage creator accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/super-admin/users/creators')} 
                  className="w-full"
                >
                  View All Creators
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dashboards">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2 text-foreground">Dashboard Access (Super Admin Only)</h2>
            <p className="text-muted-foreground mb-6">
              As a super admin, you can access any dashboard in the system. Use these buttons to navigate to different user dashboards.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-violet-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground">Brand Dashboard</CardTitle>
                  <Users className="h-5 w-5 text-violet-500" />
                </div>
                <CardDescription className="text-muted-foreground">Access brand dashboard as super admin</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/brand')}
                  className="w-full bg-violet-500 hover:bg-violet-600 text-white border-0"
                >
                  Access Brand Dashboard
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground">Creator Dashboard</CardTitle>
                  <User className="h-5 w-5 text-blue-500" />
                </div>
                <CardDescription className="text-muted-foreground">Access creator dashboard as super admin</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/creator')} 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white border-0"
                >
                  Access Creator Dashboard
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground">Agency Dashboard</CardTitle>
                  <Settings className="h-5 w-5 text-orange-500" />
                </div>
                <CardDescription className="text-muted-foreground">Access agency dashboard as super admin</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/agency')} 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0"
                >
                  Access Agency Dashboard
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground">Admin Dashboard</CardTitle>
                  <Briefcase className="h-5 w-5 text-green-500" />
                </div>
                <CardDescription className="text-muted-foreground">Access admin dashboard system</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/admin')} 
                  className="w-full bg-green-500 hover:bg-green-600 text-white border-0"
                >
                  Access Admin Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="leaderboard">
          <div className="grid gap-6">
            <CreatorLeaderboard />
          </div>
        </TabsContent>
        
        <TabsContent value="tools">
          <div className="grid gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground">User Role Fixer</h2>
              <UserRoleFixer />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminDashboard;
