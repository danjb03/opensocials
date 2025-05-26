
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { IndustrySelector } from './IndustrySelector';
import { PlatformSelector } from './PlatformSelector';
import { ContentTypeSelector } from './ContentTypeSelector';
import { AudienceSection } from './AudienceSection';

interface IndustryContentSectionProps {
  selectedIndustries: string[];
  setSelectedIndustries: (industries: string[]) => void;
  primaryPlatforms: string[];
  setPrimaryPlatforms: (platforms: string[]) => void;
  contentTypes: string[];
  setContentTypes: (types: string[]) => void;
  audienceType: string;
  setAudienceType: (type: string) => void;
  audienceLocation: string;
  setAudienceLocation: (location: string) => void;
}

export function IndustryContentSection({
  selectedIndustries,
  setSelectedIndustries,
  primaryPlatforms,
  setPrimaryPlatforms,
  contentTypes,
  setContentTypes,
  audienceType,
  setAudienceType,
  audienceLocation,
  setAudienceLocation
}: IndustryContentSectionProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Industry & Content</h3>
        <div className="space-y-6">
          <IndustrySelector 
            selectedIndustries={selectedIndustries}
            setSelectedIndustries={setSelectedIndustries}
          />
          
          <PlatformSelector 
            platforms={primaryPlatforms}
            setPlatforms={setPrimaryPlatforms}
          />

          <ContentTypeSelector 
            contentTypes={contentTypes}
            setContentTypes={setContentTypes}
          />

          <AudienceSection 
            audienceType={audienceType}
            setAudienceType={setAudienceType}
            audienceLocation={audienceLocation}
            setAudienceLocation={setAudienceLocation}
          />
        </div>
      </CardContent>
    </Card>
  );
}
