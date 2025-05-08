
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserRoleFixer from '@/components/admin/UserRoleFixer';
import { Users, LayoutDashboard, User, Settings } from 'lucide-react';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Super Admin Dashboard</h1>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
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
                <Button variant="outline" className="w-full">View All Brands</Button>
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
          
          {/* New dashboard navigation cards */}
          <h2 className="text-xl font-semibold mt-10 mb-4">Dashboard Access</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-l-4 border-l-violet-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Brand Dashboard</CardTitle>
                  <Users className="h-5 w-5 text-violet-500" />
                </div>
                <CardDescription>Access and manage brand dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/super-admin/brands')}
                  className="w-full bg-violet-500 hover:bg-violet-600"
                >
                  Go to Brand Dashboard
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Creator Dashboard</CardTitle>
                  <User className="h-5 w-5 text-blue-500" />
                </div>
                <CardDescription>Access and manage creator dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/super-admin/creators')} 
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  Go to Creator Dashboard
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Admin Dashboard</CardTitle>
                  <Settings className="h-5 w-5 text-green-500" />
                </div>
                <CardDescription>Access and manage admin dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/super-admin/admins')} 
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  Go to Admin Dashboard
                </Button>
              </CardContent>
            </Card>
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
