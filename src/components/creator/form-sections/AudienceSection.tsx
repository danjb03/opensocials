
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

const audienceTypeOptions = [
  { value: 'gen-z', label: 'Gen Z' },
  { value: 'millennials', label: 'Millennials' },
  { value: 'gen-x', label: 'Gen X' },
  { value: 'baby-boomers', label: 'Baby Boomers' },
  { value: 'mixed', label: 'Mixed' },
  { value: 'niche', label: 'Niche' },
];

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
        <Select value={audienceType || 'mixed'} onValueChange={setAudienceType}>
          <SelectTrigger id="audienceType">
            <SelectValue placeholder="Select audience" />
          </SelectTrigger>
          <SelectContent>
            {audienceTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
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
