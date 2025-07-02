
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Clock, CheckCircle } from 'lucide-react';

interface Deal {
  id: string;
  title?: string;
  value?: number;
  status: string;
  created_at?: string;
}

interface Connection {
  id: string;
  status: string;
  created_at?: string;
}

interface PerformanceMetricsProps {
  deals: Deal[];
  connections: Connection[];
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ deals, connections }) => {
  const successRate = deals.length > 0 ? ((deals.filter(d => d.status === 'completed').length / deals.length) * 100) : 0;
  const avgDealValue = deals.length > 0 ? deals.reduce((sum, deal) => sum + (deal.value || 0), 0) / deals.length : 0;
  const responseTime = '24h'; // Placeholder
  const completionRate = deals.length > 0 ? ((deals.filter(d => d.status === 'completed').length / deals.length) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white">Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-white">{successRate.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <Target className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold text-white">${avgDealValue.toFixed(0)}</div>
            <div className="text-sm text-muted-foreground">Avg Deal Value</div>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <Clock className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold text-white">{responseTime}</div>
            <div className="text-sm text-muted-foreground">Avg Response</div>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <CheckCircle className="h-6 w-6 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold text-white">{completionRate.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
