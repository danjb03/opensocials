
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SecurityMetrics } from './SecurityMetrics';
import { AlertsCard } from './AlertsCard';
import { ActionsCard } from './ActionsCard';

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
      <SecurityMetrics stats={stats} />

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AlertsCard 
          pendingRoles={stats?.pendingRoles} 
          flaggedUsers={stats?.flaggedUsers} 
        />
        <ActionsCard />
      </div>
    </div>
  );
}
