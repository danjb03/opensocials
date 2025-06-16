
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
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      textColor: "text-blue-900"
    },
    {
      title: "Pending Role Requests",
      value: stats?.pendingRoles || 0,
      icon: AlertTriangle,
      description: "Awaiting approval",
      bgColor: stats?.pendingRoles && stats.pendingRoles > 0 ? "bg-yellow-50" : "bg-green-50",
      iconColor: stats?.pendingRoles && stats.pendingRoles > 0 ? "text-yellow-600" : "text-green-600",
      textColor: stats?.pendingRoles && stats.pendingRoles > 0 ? "text-yellow-900" : "text-green-900"
    },
    {
      title: "Active Security Rules",
      value: stats?.activeRules || 0,
      icon: Shield,
      description: "R4 rules monitoring platform",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      textColor: "text-blue-900"
    },
    {
      title: "Recent Audit Events",
      value: stats?.recentAudits || 0,
      icon: Activity,
      description: "Last 24 hours",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      textColor: "text-blue-900"
    },
    {
      title: "Flagged Users",
      value: stats?.flaggedUsers || 0,
      icon: Flag,
      description: "Requiring attention",
      bgColor: stats?.flaggedUsers && stats.flaggedUsers > 0 ? "bg-red-50" : "bg-green-50",
      iconColor: stats?.flaggedUsers && stats.flaggedUsers > 0 ? "text-red-600" : "text-green-600",
      textColor: stats?.flaggedUsers && stats.flaggedUsers > 0 ? "text-red-900" : "text-green-900"
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <div className="w-24 h-5 bg-gray-300 rounded"></div>
                <div className="w-32 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <Database className="h-6 w-6 text-white" />
          <h2 className="text-2xl font-semibold text-white">Security Overview</h2>
        </div>
        <p className="text-gray-300">
          Real-time security metrics and platform health indicators
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {securityMetrics.map((metric) => (
          <div
            key={metric.title}
            className={`${metric.bgColor} rounded-2xl p-6 border transition-all duration-200 hover:shadow-lg hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${metric.bgColor} ${metric.iconColor}`}>
                <metric.icon className="h-6 w-6" />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border">
                <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className={`font-semibold text-lg ${metric.textColor}`}>{metric.title}</h3>
              <p className={`text-sm opacity-75 ${metric.textColor}`}>{metric.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.pendingRoles && stats.pendingRoles > 0 ? (
                <div className="flex items-center gap-3 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="font-medium text-yellow-300">
                      {stats.pendingRoles} pending role request{stats.pendingRoles > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-yellow-400/80">Review user role requests</p>
                  </div>
                </div>
              ) : null}
              
              {stats?.flaggedUsers && stats.flaggedUsers > 0 ? (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                  <Flag className="h-5 w-5 text-red-400" />
                  <div>
                    <p className="font-medium text-red-300">
                      {stats.flaggedUsers} flagged user{stats.flaggedUsers > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-red-400/80">Requires immediate attention</p>
                  </div>
                </div>
              ) : null}
              
              {(!stats?.pendingRoles || stats.pendingRoles === 0) && 
               (!stats?.flaggedUsers || stats.flaggedUsers === 0) && (
                <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                  <Shield className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="font-medium text-green-300">All systems secure</p>
                    <p className="text-sm text-green-400/80">No security alerts detected</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 group">
                <div className="font-medium text-white group-hover:text-blue-300 transition-colors">Review Pending Roles</div>
                <div className="text-sm text-gray-400">Approve or reject user role requests</div>
              </button>
              <button className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 group">
                <div className="font-medium text-white group-hover:text-blue-300 transition-colors">View Audit Logs</div>
                <div className="text-sm text-gray-400">Check recent security events</div>
              </button>
              <button className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 group">
                <div className="font-medium text-white group-hover:text-blue-300 transition-colors">Manage R4 Rules</div>
                <div className="text-sm text-gray-400">Configure automated security rules</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
