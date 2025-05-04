
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserRoleFixer from '@/components/admin/UserRoleFixer';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
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
