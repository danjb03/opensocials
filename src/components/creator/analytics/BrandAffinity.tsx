
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { safeToNumber } from './utils';

interface BrandAffinityProps {
  brandAffinity: any;
}

export const BrandAffinity: React.FC<BrandAffinityProps> = ({ brandAffinity }) => {
  if (!brandAffinity) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Brand Affinity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(brandAffinity)
            .slice(0, 9)
            .map(([brand, score]) => (
            <div key={brand} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">{brand}</span>
              <Badge variant="outline">{safeToNumber(score).toFixed(1)}%</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
