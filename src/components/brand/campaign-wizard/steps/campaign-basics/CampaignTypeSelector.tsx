
import React from 'react';
import { FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Calendar, Repeat, RotateCcw, Infinity } from 'lucide-react';

const campaignTypes = [{
  value: 'Single',
  label: 'Single Campaign',
  description: 'One-time campaign with specific deliverables',
  icon: <Clock className="h-4 w-4" />
}, {
  value: 'Weekly',
  label: 'Weekly Campaign',
  description: 'Recurring weekly content for short-term goals',
  icon: <Calendar className="h-4 w-4" />
}, {
  value: 'Monthly',
  label: 'Monthly Campaign',
  description: 'Monthly content series for ongoing engagement',
  icon: <Repeat className="h-4 w-4" />
}, {
  value: '12-Month Retainer',
  label: '12-Month Retainer',
  description: 'Long-term partnership with consistent content',
  icon: <RotateCcw className="h-4 w-4" />
}, {
  value: 'Evergreen',
  label: 'Evergreen Campaign',
  description: 'Ongoing campaign without fixed end date',
  icon: <Infinity className="h-4 w-4" />
}];

interface CampaignTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  errors: FieldErrors<any>;
}

export const CampaignTypeSelector: React.FC<CampaignTypeSelectorProps> = ({
  value,
  onChange,
  errors
}) => {
  const selectedCampaignType = campaignTypes.find(type => type.value === value);

  return (
    <div className="space-y-3">
      <Label htmlFor="campaign_type" className="text-sm font-medium text-foreground">
        Campaign Type *
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-background border-border text-foreground h-auto min-h-[60px] p-4">
          <SelectValue placeholder="Select campaign duration and type">
            {selectedCampaignType && (
              <div className="flex items-center gap-3 text-left">
                <div className="text-foreground">
                  {selectedCampaignType.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground">{selectedCampaignType.label}</div>
                  <div className="text-sm text-muted-foreground">{selectedCampaignType.description}</div>
                </div>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          {campaignTypes.map(type => (
            <SelectItem 
              key={type.value} 
              value={type.value} 
              className="text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground p-4 cursor-pointer data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="text-current">
                  {type.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-current">{type.label}</div>
                  <div className="text-sm text-current opacity-70">{type.description}</div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.campaign_type && (
        <p className="text-sm text-slate-300">{String(errors.campaign_type.message || 'Please select a campaign type')}</p>
      )}
    </div>
  );
};
