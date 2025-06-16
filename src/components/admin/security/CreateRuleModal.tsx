
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CreateRuleModalProps {
  children?: React.ReactNode;
  templateRule?: {
    name: string;
    description: string;
    condition: any;
    action: any;
  };
}

export function CreateRuleModal({ children, templateRule }: CreateRuleModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    rule_name: templateRule?.name || '',
    rule_description: templateRule?.description || '',
    priority: 1,
    enabled: true
  });

  const queryClient = useQueryClient();

  const createRuleMutation = useMutation({
    mutationFn: async (ruleData: any) => {
      const { error } = await supabase
        .from('r4_rules')
        .insert({
          rule_name: ruleData.rule_name,
          rule_description: ruleData.rule_description,
          rule_condition: templateRule?.condition || { type: 'custom', conditions: [] },
          rule_action: templateRule?.action || { type: 'log', severity: 'medium' },
          priority: ruleData.priority,
          enabled: ruleData.enabled
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['r4-rules'] });
      toast.success('Rule created successfully');
      setOpen(false);
      setFormData({
        rule_name: '',
        rule_description: '',
        priority: 1,
        enabled: true
      });
    },
    onError: (error) => {
      toast.error(`Failed to create rule: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.rule_name.trim()) {
      toast.error('Rule name is required');
      return;
    }
    createRuleMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Rule
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Security Rule</DialogTitle>
          <DialogDescription>
            Create a new R4 security rule for automated platform monitoring
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rule_name">Rule Name</Label>
            <Input
              id="rule_name"
              value={formData.rule_name}
              onChange={(e) => setFormData(prev => ({ ...prev, rule_name: e.target.value }))}
              placeholder="Enter rule name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rule_description">Description</Label>
            <Textarea
              id="rule_description"
              value={formData.rule_description}
              onChange={(e) => setFormData(prev => ({ ...prev, rule_description: e.target.value }))}
              placeholder="Describe what this rule does"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, priority: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">High (1)</SelectItem>
                <SelectItem value="2">Medium (2)</SelectItem>
                <SelectItem value="3">Low (3)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {templateRule && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                This rule will be created from the "{templateRule.name}" template
              </p>
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createRuleMutation.isPending}
            >
              {createRuleMutation.isPending ? 'Creating...' : 'Create Rule'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
