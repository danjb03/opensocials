
import React, { useState } from 'react';
import { Network, Database, Users, FileText, CreditCard, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import AdminCRMLayout from '@/components/layouts/AdminCRMLayout';
import SystemArchitecture from '@/components/admin/platform-map/SystemArchitecture';
import DatabaseSchema from '@/components/admin/platform-map/DatabaseSchema';
import UserFlows from '@/components/admin/platform-map/UserFlows';
import DealWorkflow from '@/components/admin/platform-map/DealWorkflow';

export default function PlatformMap() {
  const { role } = useUnifiedAuth();
  const [activeTab, setActiveTab] = useState('architecture');

  // Check admin access
  if (role !== 'admin' && role !== 'super_admin') {
    return (
      <AdminCRMLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
        </div>
      </AdminCRMLayout>
    );
  }

  return (
    <AdminCRMLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Network className="h-8 w-8" />
              Platform Architecture Map
            </h1>
            <p className="text-muted-foreground">
              Comprehensive overview of system architecture, workflows, and bottleneck analysis
            </p>
          </div>
          <Badge variant="outline" className="gap-1">
            <Shield className="h-3 w-3" />
            Admin Only
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="architecture" className="gap-2">
              <Zap className="h-4 w-4" />
              System Architecture
            </TabsTrigger>
            <TabsTrigger value="database" className="gap-2">
              <Database className="h-4 w-4" />
              Database Schema
            </TabsTrigger>
            <TabsTrigger value="workflows" className="gap-2">
              <Users className="h-4 w-4" />
              User Flows
            </TabsTrigger>
            <TabsTrigger value="deals" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Deal Process
            </TabsTrigger>
          </TabsList>

          <TabsContent value="architecture" className="space-y-6">
            <SystemArchitecture />
          </TabsContent>

          <TabsContent value="database" className="space-y-6">
            <DatabaseSchema />
          </TabsContent>

          <TabsContent value="workflows" className="space-y-6">
            <UserFlows />
          </TabsContent>

          <TabsContent value="deals" className="space-y-6">
            <DealWorkflow />
          </TabsContent>
        </Tabs>
      </div>
    </AdminCRMLayout>
  );
}
