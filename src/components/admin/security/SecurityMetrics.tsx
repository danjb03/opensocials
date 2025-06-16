
import React from 'react';
import { Users, AlertTriangle, Shield, Activity, Flag } from 'lucide-react';
import { MetricCard } from './MetricCard';

interface SecurityMetricsProps {
  stats?: {
    totalUsers: number;
    pendingRoles: number;
    activeRules: number;
    recentAudits: number;
    flaggedUsers: number;
  };
}

export function SecurityMetrics({ stats }: SecurityMetricsProps) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {securityMetrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  );
}
