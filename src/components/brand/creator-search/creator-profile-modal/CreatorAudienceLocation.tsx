
import React from 'react';
import { Globe } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Creator } from '@/types/creator';

interface CreatorAudienceLocationProps {
  audienceLocation?: Creator['audienceLocation'];
}

export const CreatorAudienceLocation = ({ audienceLocation }: CreatorAudienceLocationProps) => {
  if (!audienceLocation) return null;
  
  return (
    <div className="space-y-1.5">
      <h3 className="font-medium text-sm flex items-center gap-1">
        <Globe className="h-3 w-3" />
        Audience Location
      </h3>
      
      <div className="bg-muted/30 p-2 rounded-lg text-xs">
        <div className="mb-1.5">
          <h4 className="text-[10px] text-muted-foreground">Primary Location</h4>
          <p className="font-semibold">{audienceLocation.primary}</p>
        </div>
        
        {audienceLocation.secondary && audienceLocation.secondary.length > 0 && (
          <div className="mb-1.5">
            <h4 className="text-[10px] text-muted-foreground">Secondary Locations</h4>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {audienceLocation.secondary.map(location => (
                <Badge key={location} variant="outline" className="text-[10px] py-0">
                  {location}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {audienceLocation.countries && audienceLocation.countries.length > 0 && (
          <div>
            <h4 className="text-[10px] text-muted-foreground mb-0.5">Audience Breakdown</h4>
            {audienceLocation.countries.map(country => (
              <div key={country.name} className="mb-1">
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span>{country.name}</span>
                  <span className="font-medium">{country.percentage}%</span>
                </div>
                <Progress value={country.percentage} className="h-1" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
