
import React from 'react';
import InviteUserForm from '@/components/admin/InviteUserForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/admin/InviteLogsColumns';

export default function InviteUsers() {
  const { data: inviteLogsData, isLoading } = useQuery({
    queryKey: ['invite-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invite_logs')
        .select('*')
        .order('sent_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">User Invitations</h1>
      
      <Tabs defaultValue="invite">
        <TabsList className="mb-4">
          <TabsTrigger value="invite">Send Invitation</TabsTrigger>
          <TabsTrigger value="logs">Invitation Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="invite" className="mt-0">
          <div className="max-w-md mx-auto">
            <InviteUserForm />
          </div>
        </TabsContent>
        
        <TabsContent value="logs" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Invitation History</CardTitle>
              <CardDescription>A log of all invitations sent to users</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={columns} 
                data={inviteLogsData || []} 
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
