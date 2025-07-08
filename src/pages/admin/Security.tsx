
import React, { useState } from 'react';
import { Shield, Users, FileText, Settings, Flag, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import AdminCRMLayout from '@/components/layouts/AdminCRMLayout';
import { SecurityAuditLogs } from '@/components/admin/security/SecurityAuditLogs';
import { UserRoleManager } from '@/components/admin/security/UserRoleManager';
import { R4RulesManager } from '@/components/admin/security/R4RulesManager';
import { SecurityOverview } from '@/components/admin/security/SecurityOverview';

export default function SecurityPage() {
  const { role } = useUnifiedAuth();
  const [activeTab, setActiveTab] = useState('overview');

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
              <Shield className="h-8 w-8" />
              Security Management
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage platform security, user permissions, and access controls
            </p>
          </div>
          <Badge variant="outline" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Admin Only
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="gap-2">
              <Shield className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              User Roles
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <FileText className="h-4 w-4" />
              Audit Logs
            </TabsTrigger>
            <TabsTrigger value="rules" className="gap-2">
              <Settings className="h-4 w-4" />
              R4 Rules
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SecurityOverview />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserRoleManager />
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <SecurityAuditLogs />
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            <R4RulesManager />
          </TabsContent>
        </Tabs>
      </div>
    </AdminCRMLayout>
  );
}
