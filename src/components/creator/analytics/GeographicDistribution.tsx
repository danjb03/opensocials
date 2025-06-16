
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';
import { safeToNumber } from './utils';

interface GeographicDistributionProps {
  geographicDistribution: any;
}

export const GeographicDistribution: React.FC<GeographicDistributionProps> = ({ 
  geographicDistribution 
}) => {
  if (!geographicDistribution) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Audience Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(geographicDistribution)
            .slice(0, 10)
            .map(([location, percentage]) => (
            <div key={location} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">{location}</span>
              <Badge variant="secondary">{safeToNumber(percentage)}%</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
