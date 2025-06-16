
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, Users, AlertTriangle, Activity, Database, Flag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

export function SecurityOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['security-overview'],
    queryFn: async () => {
      const [
        { count: totalUsers },
        { count: pendingRoles },
        { count: recentAudits },
        { count: activeRules },
        { count: flaggedUsers }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('user_roles').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('security_audit_log').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('r4_rules').select('*', { count: 'exact', head: true }).eq('enabled', true),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('flagged', true)
      ]);

      return {
        totalUsers: totalUsers || 0,
        pendingRoles: pendingRoles || 0,
        recentAudits: recentAudits || 0,
        activeRules: activeRules || 0,
        flaggedUsers: flaggedUsers || 0
      };
    },
  });

  const securityMetrics = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      description: "Registered platform users",
      status: "info"
    },
    {
      title: "Pending Role Requests",
      value: stats?.pendingRoles || 0,
      icon: AlertTriangle,
      description: "Awaiting approval",
      status: stats?.pendingRoles && stats.pendingRoles > 0 ? "warning" : "success"
    },
    {
      title: "Active Security Rules",
      value: stats?.activeRules || 0,
      icon: Shield,
      description: "R4 rules monitoring platform",
      status: "info"
    },
    {
      title: "Recent Audit Events",
      value: stats?.recentAudits || 0,
      icon: Activity,
      description: "Last 24 hours",
      status: "info"
    },
    {
      title: "Flagged Users",
      value: stats?.flaggedUsers || 0,
      icon: Flag,
      description: "Requiring attention",
      status: stats?.flaggedUsers && stats.flaggedUsers > 0 ? "warning" : "success"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Security Overview
          </CardTitle>
          <CardDescription>
            Real-time security metrics and platform health indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityMetrics.map((metric) => (
              <div
                key={metric.title}
                className={`p-4 rounded-lg border ${getStatusColor(metric.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className="h-6 w-6" />
                  <Badge variant="outline" className="font-mono">
                    {metric.value}
                  </Badge>
                </div>
                <h3 className="font-medium">{metric.title}</h3>
                <p className="text-sm opacity-80">{metric.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.pendingRoles && stats.pendingRoles > 0 ? (
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-900">
                      {stats.pendingRoles} pending role request{stats.pendingRoles > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-yellow-700">Review user role requests</p>
                  </div>
                </div>
              ) : null}
              
              {stats?.flaggedUsers && stats.flaggedUsers > 0 ? (
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <Flag className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900">
                      {stats.flaggedUsers} flagged user{stats.flaggedUsers > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-red-700">Requires immediate attention</p>
                  </div>
                </div>
              ) : null}
              
              {(!stats?.pendingRoles || stats.pendingRoles === 0) && 
               (!stats?.flaggedUsers || stats.flaggedUsers === 0) && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">All systems secure</p>
                    <p className="text-sm text-green-700">No security alerts detected</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="font-medium">Review Pending Roles</div>
                <div className="text-sm text-muted-foreground">Approve or reject user role requests</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="font-medium">View Audit Logs</div>
                <div className="text-sm text-muted-foreground">Check recent security events</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="font-medium">Manage R4 Rules</div>
                <div className="text-sm text-muted-foreground">Configure automated security rules</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
