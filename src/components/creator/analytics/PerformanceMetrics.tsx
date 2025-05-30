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
  return <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{acceptanceRate}%</div>
            <div className="text-sm text-muted-foreground">Deal Acceptance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">${avgDealValue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Avg Deal Value</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{responseRate}%</div>
            <div className="text-sm text-muted-foreground">Response Rate</div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Recent Activity</h4>
          <div className="space-y-2">
            {recentDeals.length > 0 ? recentDeals.map(deal => <div key={deal.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {deal.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {deal.status === 'accepted' && <Clock className="h-4 w-4 text-blue-500" />}
                    {deal.status === 'pending' && <Clock className="h-4 w-4 text-yellow-500" />}
                    {deal.status === 'declined' && <XCircle className="h-4 w-4 text-red-500" />}
                    <span className="text-sm font-medium truncate max-w-[120px]">{deal.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">${deal.value}</span>
                    <Badge variant="outline" className="text-xs">
                      {deal.status}
                    </Badge>
                  </div>
                </div>) : <p className="text-sm text-muted-foreground">You haven’t made a move yet. Change that today.</p>}
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default PerformanceMetrics;