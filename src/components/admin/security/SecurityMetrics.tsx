
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
      bgColor: "bg-card border-border",
      iconColor: "text-blue-400",
      textColor: "text-foreground"
    },
    {
      title: "Pending Role Requests",
      value: stats?.pendingRoles || 0,
      icon: AlertTriangle,
      description: "Awaiting approval",
      bgColor: stats?.pendingRoles && stats.pendingRoles > 0 ? "bg-card border-yellow-500/30" : "bg-card border-border",
      iconColor: stats?.pendingRoles && stats.pendingRoles > 0 ? "text-yellow-400" : "text-green-400",
      textColor: "text-foreground"
    },
    {
      title: "Active Security Rules",
      value: stats?.activeRules || 0,
      icon: Shield,
      description: "R4 rules monitoring platform",
      bgColor: "bg-card border-border",
      iconColor: "text-blue-400",
      textColor: "text-foreground"
    },
    {
      title: "Recent Audit Events",
      value: stats?.recentAudits || 0,
      icon: Activity,
      description: "Last 24 hours",
      bgColor: "bg-card border-border",
      iconColor: "text-blue-400",
      textColor: "text-foreground"
    },
    {
      title: "Flagged Users",
      value: stats?.flaggedUsers || 0,
      icon: Flag,
      description: "Requiring attention",
      bgColor: stats?.flaggedUsers && stats.flaggedUsers > 0 ? "bg-card border-red-500/30" : "bg-card border-border",
      iconColor: stats?.flaggedUsers && stats.flaggedUsers > 0 ? "text-red-400" : "text-green-400",
      textColor: "text-foreground"
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
