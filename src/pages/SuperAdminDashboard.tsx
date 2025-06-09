
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserRoleFixer from '@/components/admin/UserRoleFixer';
import { CreatorLeaderboard } from '@/components/admin/CreatorLeaderboard';
import { Users, LayoutDashboard, User, Settings, Briefcase, Award } from 'lucide-react';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Super Admin Dashboard</h1>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leaderboard">Creator Earnings</TabsTrigger>
          <TabsTrigger value="tools">Admin Tools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>System Users</CardTitle>
                <CardDescription>Manage all users in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">View All Users</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Brands</CardTitle>
                <CardDescription>Manage brand accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => navigate('/admin/crm/brands')} className="w-full">View All Brands</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Creators</CardTitle>
                <CardDescription>Manage creator accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">View All Creators</Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Super Admin Dashboard Access - This is the key section that was missing */}
          <h2 className="text-xl font-semibold mt-10 mb-4">Dashboard Access (Super Admin)</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-violet-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Brand Dashboard</CardTitle>
                  <Users className="h-5 w-5 text-violet-500" />
                </div>
                <CardDescription>Access brand dashboard as super admin</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/brand')}
                  className="w-full bg-violet-500 hover:bg-violet-600"
                >
                  Access Brand Dashboard
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Creator Dashboard</CardTitle>
                  <User className="h-5 w-5 text-blue-500" />
                </div>
                <CardDescription>Access creator dashboard as super admin</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/creator')} 
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  Access Creator Dashboard
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Agency Dashboard</CardTitle>
                  <Settings className="h-5 w-5 text-orange-500" />
                </div>
                <CardDescription>Access agency dashboard as super admin</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/agency')} 
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  Access Agency Dashboard
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Admin Dashboard</CardTitle>
                  <Briefcase className="h-5 w-5 text-green-500" />
                </div>
                <CardDescription>Access admin dashboard system</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/admin')} 
                  className="w-full bg-green-500 hover:bg-green-600"
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
              <h2 className="text-xl font-semibold mb-4">User Role Fixer</h2>
              <UserRoleFixer />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminDashboard;
