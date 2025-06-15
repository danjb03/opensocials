
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Power, PowerOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface R4Rule {
  id: string;
  rule_name: string;
  rule_description?: string;
  rule_condition: any;
  rule_action: any;
  enabled: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export function R4RulesManager() {
  const queryClient = useQueryClient();

  const { data: rules, isLoading } = useQuery({
    queryKey: ['r4-rules'],
    queryFn: async (): Promise<R4Rule[]> => {
      const { data, error } = await supabase
        .from('r4_rules')
        .select('*')
        .order('priority', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  const toggleRuleMutation = useMutation({
    mutationFn: async ({ ruleId, enabled }: { ruleId: string; enabled: boolean }) => {
      const { error } = await supabase
        .from('r4_rules')
        .update({ enabled })
        .eq('id', ruleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['r4-rules'] });
      toast.success('Rule status updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update rule: ${error.message}`);
    },
  });

  const deleteRuleMutation = useMutation({
    mutationFn: async (ruleId: string) => {
      const { error } = await supabase
        .from('r4_rules')
        .delete()
        .eq('id', ruleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['r4-rules'] });
      toast.success('Rule deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete rule: ${error.message}`);
    },
  });

  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    toggleRuleMutation.mutate({ ruleId, enabled });
  };

  const handleDeleteRule = (ruleId: string) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      deleteRuleMutation.mutate(ruleId);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>R4 Security Rules</CardTitle>
            <CardDescription>
              Configure and manage automated security rules and enforcement
            </CardDescription>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Rule
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading rules...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No security rules configured
                      </TableCell>
                    </TableRow>
                  ) : (
                    rules?.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium">{rule.rule_name}</TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {rule.rule_description || 'No description'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{rule.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={rule.enabled}
                              onCheckedChange={(enabled) => handleToggleRule(rule.id, enabled)}
                              disabled={toggleRuleMutation.isPending}
                            />
                            {rule.enabled ? (
                              <Badge className="bg-green-100 text-green-800 gap-1">
                                <Power className="h-3 w-3" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1">
                                <PowerOff className="h-3 w-3" />
                                Disabled
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(rule.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline" className="gap-1">
                              <Edit className="h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteRule(rule.id)}
                              disabled={deleteRuleMutation.isPending}
                              className="gap-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </div>
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

      <Card>
        <CardHeader>
          <CardTitle>Rule Templates</CardTitle>
          <CardDescription>
            Quick setup for common security scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg space-y-2">
              <h3 className="font-medium">Rate Limiting</h3>
              <p className="text-sm text-muted-foreground">
                Prevent excessive API requests from users
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Create Rule
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg space-y-2">
              <h3 className="font-medium">Suspicious Activity</h3>
              <p className="text-sm text-muted-foreground">
                Flag unusual user behavior patterns
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Create Rule
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg space-y-2">
              <h3 className="font-medium">Content Moderation</h3>
              <p className="text-sm text-muted-foreground">
                Automatically moderate user-generated content
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Create Rule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
