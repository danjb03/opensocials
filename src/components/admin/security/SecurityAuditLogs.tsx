
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export function SecurityAuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');

  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['security-audit-logs', searchTerm, actionFilter, resourceFilter],
    queryFn: async (): Promise<AuditLog[]> => {
      let query = supabase
        .from('security_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (searchTerm) {
        query = query.or(`action.ilike.%${searchTerm}%,resource_type.ilike.%${searchTerm}%`);
      }

      if (actionFilter !== 'all') {
        query = query.eq('action', actionFilter);
      }

      if (resourceFilter !== 'all') {
        query = query.eq('resource_type', resourceFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const getActionBadge = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return <Badge className="bg-green-100 text-green-800">Login</Badge>;
      case 'logout':
        return <Badge variant="outline">Logout</Badge>;
      case 'create':
        return <Badge className="bg-blue-100 text-blue-800">Create</Badge>;
      case 'update':
        return <Badge className="bg-yellow-100 text-yellow-800">Update</Badge>;
      case 'delete':
        return <Badge variant="destructive">Delete</Badge>;
      case 'access_denied':
        return <Badge variant="destructive">Access Denied</Badge>;
      default:
        return <Badge variant="secondary">{action}</Badge>;
    }
  };

  const uniqueActions = [...new Set(auditLogs?.map(log => log.action) || [])];
  const uniqueResources = [...new Set(auditLogs?.map(log => log.resource_type) || [])];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Audit Logs</CardTitle>
          <CardDescription>
            Monitor user actions and security events across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={resourceFilter} onValueChange={setResourceFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by resource" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resources</SelectItem>
                {uniqueResources.map((resource) => (
                  <SelectItem key={resource} value={resource}>
                    {resource}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading audit logs...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>User Agent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No audit logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    auditLogs?.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>{getActionBadge(log.action)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.resource_type}</Badge>
                          {log.resource_id && (
                            <span className="text-xs text-muted-foreground ml-2">
                              ({log.resource_id.slice(0, 8)}...)
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {log.user_id ? log.user_id.slice(0, 8) + '...' : 'Anonymous'}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {log.ip_address || 'Unknown'}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm">
                          {log.user_agent || 'Unknown'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
