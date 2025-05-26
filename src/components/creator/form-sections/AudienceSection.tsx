
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AudienceSectionProps {
  audienceType: string;
  setAudienceType: (type: string) => void;
  audienceLocation: string;
  setAudienceLocation: (location: string) => void;
}

export function AudienceSection({ 
  audienceType, 
  setAudienceType, 
  audienceLocation, 
  setAudienceLocation 
}: AudienceSectionProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="audienceType">Audience Type</Label>
        <Select value={audienceType} onValueChange={setAudienceType}>
          <SelectTrigger id="audienceType">
            <SelectValue placeholder="Select audience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Gen Z">Gen Z</SelectItem>
            <SelectItem value="Millennials">Millennials</SelectItem>
            <SelectItem value="Gen X">Gen X</SelectItem>
            <SelectItem value="Baby Boomers">Baby Boomers</SelectItem>
            <SelectItem value="Mixed">Mixed</SelectItem>
            <SelectItem value="Niche">Niche</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="audienceLocation">Primary Audience Location</Label>
        <Input
          id="audienceLocation"
          value={audienceLocation}
          onChange={(e) => setAudienceLocation(e.target.value)}
          placeholder="e.g. United States, Global, etc."
        />
      </div>
    </div>
  );
}
