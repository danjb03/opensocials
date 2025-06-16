
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
import { CreateRuleModal } from './CreateRuleModal';

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

const ruleTemplates = [
  {
    name: "Rate Limiting",
    description: "Prevent excessive API requests from users",
    condition: {
      type: "rate_limit",
      window: "1m",
      max_requests: 100,
      target: "user_requests"
    },
    action: {
      type: "block",
      duration: "5m",
      severity: "medium"
    }
  },
  {
    name: "Suspicious Activity",
    description: "Flag unusual user behavior patterns",
    condition: {
      type: "behavior_analysis",
      metrics: ["login_frequency", "location_changes", "device_changes"],
      threshold: 0.8
    },
    action: {
      type: "flag",
      severity: "high",
      notify_admin: true
    }
  },
  {
    name: "Content Moderation",
    description: "Automatically moderate user-generated content",
    condition: {
      type: "content_analysis",
      filters: ["spam", "inappropriate", "harmful"],
      confidence_threshold: 0.7
    },
    action: {
      type: "quarantine",
      severity: "medium",
      review_required: true
    }
  }
];

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
          <CreateRuleModal />
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
                        No security rules configured. Use the templates below to get started.
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
            {ruleTemplates.map((template) => (
              <div key={template.name} className="p-4 border rounded-lg space-y-2">
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>
                <CreateRuleModal templateRule={template}>
                  <Button size="sm" variant="outline" className="w-full">
                    Create Rule
                  </Button>
                </CreateRuleModal>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
