
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from './utils';

interface PerformanceOverviewProps {
  primaryPlatform: any;
}

export const PerformanceOverview: React.FC<PerformanceOverviewProps> = ({ primaryPlatform }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-3xl font-bold text-green-600">
              {primaryPlatform.credibility_score ? (primaryPlatform.credibility_score * 10).toFixed(1) : 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">Credibility Score</div>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-3xl font-bold text-blue-600">
              {formatNumber(primaryPlatform.content_count)}
            </div>
            <div className="text-sm text-muted-foreground">Total Content</div>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-3xl font-bold text-purple-600">
              {primaryPlatform.sponsored_posts_performance ? 
                `${(primaryPlatform.sponsored_posts_performance * 100).toFixed(1)}%` : 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">Sponsored Performance</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
