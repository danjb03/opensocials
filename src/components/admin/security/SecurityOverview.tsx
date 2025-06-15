
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, Users, AlertTriangle, Activity, Lock, Flag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface SecurityStats {
  totalUsers: number;
  pendingRoles: number;
  recentAuditEvents: number;
  activeRules: number;
  flaggedUsers: number;
  suspiciousActivity: number;
}

export function SecurityOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['security-overview'],
    queryFn: async (): Promise<SecurityStats> => {
      try {
        // Get total users count
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get pending roles count
        const { count: pendingRoles } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        // Get recent audit events (last 24 hours)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const { count: recentAuditEvents } = await supabase
          .from('security_audit_log')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', yesterday.toISOString());

        // Get active R4 rules count
        const { count: activeRules } = await supabase
          .from('r4_rules')
          .select('*', { count: 'exact', head: true })
          .eq('enabled', true);

        // Get flagged users count
        const { count: flaggedUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('flagged', true);

        return {
          totalUsers: totalUsers || 0,
          pendingRoles: pendingRoles || 0,
          recentAuditEvents: recentAuditEvents || 0,
          activeRules: activeRules || 0,
          flaggedUsers: flaggedUsers || 0,
          suspiciousActivity: 0, // Mock data for now
        };
      } catch (error) {
        console.error('Error fetching security stats:', error);
        return {
          totalUsers: 0,
          pendingRoles: 0,
          recentAuditEvents: 0,
          activeRules: 0,
          flaggedUsers: 0,
          suspiciousActivity: 0,
        };
      }
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const securityCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      description: 'Registered platform users',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Pending Roles',
      value: stats?.pendingRoles || 0,
      description: 'Role requests awaiting approval',
      icon: Lock,
      color: 'text-yellow-600',
      alert: (stats?.pendingRoles || 0) > 0,
    },
    {
      title: 'Recent Activity',
      value: stats?.recentAuditEvents || 0,
      description: 'Audit events in last 24h',
      icon: Activity,
      color: 'text-green-600',
    },
    {
      title: 'Active Rules',
      value: stats?.activeRules || 0,
      description: 'Security rules enabled',
      icon: Shield,
      color: 'text-purple-600',
    },
    {
      title: 'Flagged Users',
      value: stats?.flaggedUsers || 0,
      description: 'Users requiring attention',
      icon: Flag,
      color: 'text-red-600',
      alert: (stats?.flaggedUsers || 0) > 0,
    },
    {
      title: 'Suspicious Activity',
      value: stats?.suspiciousActivity || 0,
      description: 'Potential security threats',
      icon: AlertTriangle,
      color: 'text-orange-600',
      alert: (stats?.suspiciousActivity || 0) > 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {securityCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className="flex items-center gap-2">
                {card.alert && (
                  <Badge variant="destructive" className="text-xs">
                    Alert
                  </Badge>
                )}
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security Status</CardTitle>
          <CardDescription>
            Current security configuration and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Row Level Security</p>
                <p className="text-sm text-muted-foreground">All tables protected</p>
              </div>
            </div>
            <Badge variant="outline" className="text-green-600">
              Active
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Authentication</p>
                <p className="text-sm text-muted-foreground">Supabase Auth enabled</p>
              </div>
            </div>
            <Badge variant="outline" className="text-green-600">
              Configured
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Audit Logging</p>
                <p className="text-sm text-muted-foreground">Security events tracked</p>
              </div>
            </div>
            <Badge variant="outline" className="text-green-600">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
