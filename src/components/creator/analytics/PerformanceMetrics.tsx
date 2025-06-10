
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  value: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Connection {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface PerformanceMetricsProps {
  deals: Deal[];
  connections: Connection[];
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  deals,
  connections
}) => {
  const acceptanceRate = deals.length > 0 ? (deals.filter(deal => deal.status === 'accepted' || deal.status === 'completed').length / deals.length * 100).toFixed(1) : 0;
  const avgDealValue = deals.length > 0 ? deals.reduce((sum, deal) => sum + Number(deal.value), 0) / deals.length : 0;
  const responseRate = connections.length > 0 ? (connections.filter(conn => conn.status !== 'invited').length / connections.length * 100).toFixed(1) : 0;
  const recentDeals = deals.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-100">
          <TrendingUp className="h-5 w-5" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{acceptanceRate}%</div>
            <div className="text-sm text-gray-300">Deal Acceptance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">${avgDealValue.toLocaleString()}</div>
            <div className="text-sm text-gray-300">Avg Deal Value</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{responseRate}%</div>
            <div className="text-sm text-gray-300">Response Rate</div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-gray-100">Recent Activity</h4>
          <div className="space-y-2">
            {recentDeals.length > 0 ? (
              recentDeals.map(deal => (
                <div key={deal.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg border border-gray-700/30">
                  <div className="flex items-center gap-2">
                    {deal.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-400" />}
                    {deal.status === 'accepted' && <Clock className="h-4 w-4 text-blue-400" />}
                    {deal.status === 'pending' && <Clock className="h-4 w-4 text-yellow-400" />}
                    {deal.status === 'declined' && <XCircle className="h-4 w-4 text-red-400" />}
                    <span className="text-sm font-medium truncate max-w-[120px] text-gray-200">{deal.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-200">${deal.value}</span>
                    <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                      {deal.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-300">You haven't made a move yet. Change that today.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
