
import React from 'react';
import { AlertTriangle, Flag, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AlertsCardProps {
  pendingRoles?: number;
  flaggedUsers?: number;
}

export function AlertsCard({ pendingRoles, flaggedUsers }: AlertsCardProps) {
  const hasAlerts = (pendingRoles && pendingRoles > 0) || (flaggedUsers && flaggedUsers > 0);

  return (
    <Card className="border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Security Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingRoles && pendingRoles > 0 && (
            <div className="flex items-center gap-3 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="font-medium text-yellow-300">
                  {pendingRoles} pending role request{pendingRoles > 1 ? 's' : ''}
                </p>
                <p className="text-sm text-yellow-400/80">Review user role requests</p>
              </div>
            </div>
          )}
          
          {flaggedUsers && flaggedUsers > 0 && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
              <Flag className="h-5 w-5 text-red-400" />
              <div>
                <p className="font-medium text-red-300">
                  {flaggedUsers} flagged user{flaggedUsers > 1 ? 's' : ''}
                </p>
                <p className="text-sm text-red-400/80">Requires immediate attention</p>
              </div>
            </div>
          )}
          
          {!hasAlerts && (
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
  );
}
