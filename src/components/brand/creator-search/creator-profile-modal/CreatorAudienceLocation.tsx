
import React from 'react';
import { Globe } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Creator } from '@/types/creator';
import { cn } from '@/lib/utils';

interface CreatorAudienceLocationProps {
  audienceLocation?: Creator['audienceLocation'];
  className?: string;
}

export const CreatorAudienceLocation = ({ audienceLocation, className }: CreatorAudienceLocationProps) => {
  if (!audienceLocation) return null;
  
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
        <Globe className="h-5 w-5 text-foreground" />
        Audience Location
      </h3>
      
      <div className="bg-muted/30 border border-border rounded-xl p-4">
        <div className="mb-4">
          <h4 className="font-medium text-foreground mb-1">Primary Location</h4>
          <p className="text-lg font-semibold text-foreground">{audienceLocation.primary}</p>
        </div>
        
        {audienceLocation.secondary && audienceLocation.secondary.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-foreground mb-2">Secondary Locations</h4>
            <div className="flex flex-wrap gap-2">
              {audienceLocation.secondary.map(location => (
                <Badge key={location} variant="secondary" className="text-sm px-3 py-1 bg-secondary text-secondary-foreground">
                  {location}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {audienceLocation.countries && audienceLocation.countries.length > 0 && (
          <div>
            <h4 className="font-medium text-foreground mb-3">Audience Breakdown</h4>
            <div className="space-y-3">
              {audienceLocation.countries.map(country => (
                <div key={country.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{country.name}</span>
                    <span className="font-medium text-foreground">{country.percentage}%</span>
                  </div>
                  <Progress value={country.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
