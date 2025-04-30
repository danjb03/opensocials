
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AudienceLocationProps {
  audienceLocation: {
    primary: string;
    secondary?: string[];
    countries?: {
      name: string;
      percentage: number;
    }[];
  };
  isVisible?: boolean;
}

const AudienceLocation: React.FC<AudienceLocationProps> = ({
  audienceLocation,
  isVisible = true
}) => {
  if (!isVisible) return null;

  return (
    <Card className={`${!isVisible ? 'hidden' : ''}`}>
      <CardHeader>
        <CardTitle className="text-xl">Audience Location</CardTitle>
        <CardDescription>
          Geographic distribution of your followers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h4 className="font-medium text-sm text-muted-foreground mb-1">Primary Location</h4>
          <p className="font-semibold text-lg">{audienceLocation.primary}</p>
        </div>

        {audienceLocation.secondary && audienceLocation.secondary.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Secondary Locations</h4>
            <div className="flex flex-wrap gap-2">
              {audienceLocation.secondary.map((location, idx) => (
                <div key={idx} className="bg-secondary/20 px-3 py-1 rounded-full text-sm">
                  {location}
                </div>
              ))}
            </div>
          </div>
        )}

        {audienceLocation.countries && audienceLocation.countries.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-3">Audience Breakdown</h4>
            <div className="space-y-2">
              {audienceLocation.countries.map((country, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="w-32 truncate">{country.name}</div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${country.percentage}%` }} 
                    />
                  </div>
                  <div className="w-12 text-right text-sm">{country.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AudienceLocation;
