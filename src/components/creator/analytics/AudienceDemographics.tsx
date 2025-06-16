
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, BarChart3 } from 'lucide-react';
import { safeToNumber } from './utils';

interface AudienceDemographicsProps {
  audience: any;
}

export const AudienceDemographics: React.FC<AudienceDemographicsProps> = ({ audience }) => {
  if (!audience) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gender Distribution */}
      {audience.gender_distribution && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gender Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(audience.gender_distribution).map(([gender, percentage]) => (
                <div key={gender} className="flex items-center justify-between">
                  <span className="capitalize font-medium">{gender}</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <Progress value={safeToNumber(percentage)} className="flex-1" />
                    <span className="text-sm font-semibold w-12">{safeToNumber(percentage)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Age Distribution */}
      {audience.age_distribution && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Age Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(audience.age_distribution).map(([age, percentage]) => (
                <div key={age} className="flex items-center justify-between">
                  <span className="font-medium">{age}</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <Progress value={safeToNumber(percentage)} className="flex-1" />
                    <span className="text-sm font-semibold w-12">{safeToNumber(percentage)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
