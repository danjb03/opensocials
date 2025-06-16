
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Rocket } from 'lucide-react';
import { CampaignWizardData } from '@/types/campaignWizard';
import { ReadinessChecklist } from './review-launch/ReadinessChecklist';
import { CampaignSummary } from './review-launch/CampaignSummary';
import { ContentRequirements } from './review-launch/ContentRequirements';
import { CreatorsList } from './review-launch/CreatorsList';
import { InvestmentSummary } from './review-launch/InvestmentSummary';
import { NextStepsCard } from './review-launch/NextStepsCard';

interface ReviewLaunchStepProps {
  data?: Partial<CampaignWizardData>;
  onBack?: () => void;
  onLaunch: () => void;
  isSubmitting?: boolean;
}

const ReviewLaunchStep: React.FC<ReviewLaunchStepProps> = ({
  data,
  onBack,
  onLaunch,
  isSubmitting
}) => {
  if (!data) return null;
  
  const selectedCreators = data?.selected_creators || [];

  const readinessChecks = [
    {
      label: 'Campaign details complete',
      complete: !!(data.name && data.objective && data.description),
    },
    {
      label: 'Content requirements defined',
      complete: !!(data.content_requirements?.platforms?.length && data.content_requirements?.content_types?.length),
    },
    {
      label: 'Budget and timeline set',
      complete: !!(data.total_budget && data.timeline?.start_date && data.timeline?.end_date),
    },
    {
      label: 'Creators selected',
      complete: selectedCreators.length > 0,
    }
  ];

  const allChecksComplete = readinessChecks.every(check => check.complete);

  return (
    <div className="space-y-6">
      {/* Campaign Overview */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Rocket className="h-5 w-5" />Review & Launch Campaign
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Readiness Checklist */}
          <ReadinessChecklist data={data} />

          <Separator className="border-border" />

          {/* Campaign Summary */}
          <CampaignSummary data={data} />

          <Separator className="border-border" />

          {/* Content Requirements */}
          <ContentRequirements data={data} />

          <Separator className="border-border" />

          {/* Selected Creators */}
          <CreatorsList data={data} />

          <Separator className="border-border" />

          {/* Total Investment Summary */}
          <InvestmentSummary data={data} />
        </CardContent>
      </Card>

      {/* What Happens Next */}
      <NextStepsCard />

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={onLaunch}
          disabled={!allChecksComplete || isSubmitting}
          className="flex items-center gap-2"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Launching Campaign...
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4" />
              Launch Campaign
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ReviewLaunchStep;
