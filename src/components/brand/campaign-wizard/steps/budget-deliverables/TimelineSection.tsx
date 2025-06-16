
import React from 'react';
import { UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';
import { SingleCampaignTimeline } from './timeline-types/SingleCampaignTimeline';
import { WeeklyCampaignTimeline } from './timeline-types/WeeklyCampaignTimeline';
import { MonthlyCampaignTimeline } from './timeline-types/MonthlyCampaignTimeline';
import { RetainerTimeline } from './timeline-types/RetainerTimeline';
import { EvergreenTimeline } from './timeline-types/EvergreenTimeline';

interface TimelineSectionProps {
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  errors: FieldErrors<any>;
  campaignType: string;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  setValue,
  watch,
  errors,
  campaignType
}) => {
  const renderTimelineComponent = () => {
    const commonProps = { setValue, watch, errors };

    switch (campaignType) {
      case 'Single':
        return <SingleCampaignTimeline {...commonProps} />;
      case 'Weekly':
        return <WeeklyCampaignTimeline {...commonProps} />;
      case 'Monthly':
        return <MonthlyCampaignTimeline {...commonProps} />;
      case '12-Month Retainer':
        return <RetainerTimeline {...commonProps} />;
      case 'Evergreen':
        return <EvergreenTimeline {...commonProps} />;
      default:
        return <SingleCampaignTimeline {...commonProps} />;
    }
  };

  const getTimelineTitle = () => {
    switch (campaignType) {
      case 'Single':
        return 'Campaign Timeline';
      case 'Weekly':
        return 'Weekly Campaign Settings';
      case 'Monthly':
        return 'Monthly Campaign Settings';
      case '12-Month Retainer':
        return 'Retainer Configuration';
      case 'Evergreen':
        return 'Evergreen Campaign Settings';
      default:
        return 'Campaign Timeline';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-foreground" />
        <Label className="text-sm font-medium text-foreground">{getTimelineTitle()}</Label>
      </div>

      {renderTimelineComponent()}
    </div>
  );
};
