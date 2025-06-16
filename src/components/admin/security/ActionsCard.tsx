
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ActionsCard() {
  return (
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
  );
}
