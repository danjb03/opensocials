
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Rocket, CheckCircle } from 'lucide-react';
import { CampaignWizardData } from '@/types/campaignWizard';
import { CampaignSummary } from './review-launch/CampaignSummary';
import { CampaignBriefSummary } from './review-launch/CampaignBriefSummary';
import { InvestmentSummary } from './review-launch/InvestmentSummary';
import { CreatorsList } from './review-launch/CreatorsList';
import { ReadinessChecklist } from './review-launch/ReadinessChecklist';
import { NextStepsCard } from './review-launch/NextStepsCard';

interface ReviewLaunchStepProps {
  data?: Partial<CampaignWizardData>;
  onComplete: (data: Partial<CampaignWizardData>) => void;
  onBack?: () => void;
  onLaunch: () => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
}

const ReviewLaunchStep: React.FC<ReviewLaunchStepProps> = ({
  data,
  onComplete,
  onBack,
  onLaunch,
  isLoading,
  isSubmitting
}) => {
  const isReadyToLaunch = React.useMemo(() => {
    return !!(
      data?.name &&
      data?.brief_data &&
      data?.total_budget &&
      data?.deliverables &&
      data?.selected_creators &&
      data?.selected_creators.length > 0
    );
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Campaign Overview */}
      <Card className="bg-background border-border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl text-foreground">
            <div className="p-2 bg-foreground rounded-lg">
              <Rocket className="h-5 w-5 text-background" />
            </div>
            Review & Launch Campaign
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Campaign Summary */}
          <CampaignSummary data={data} />
          
          {/* Campaign Brief */}
          <CampaignBriefSummary data={data} />
          
          {/* Investment Summary */}
          <InvestmentSummary data={data} />
          
          {/* Selected Creators */}
          <CreatorsList data={data} />
          
          {/* Readiness Checklist */}
          <ReadinessChecklist data={data} />
        </CardContent>
      </Card>

      {/* Next Steps */}
      <NextStepsCard />

      {/* Launch Status */}
      <Card className={`border ${isReadyToLaunch ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className={`h-6 w-6 ${isReadyToLaunch ? 'text-green-600' : 'text-yellow-600'}`} />
            <div>
              <h4 className="font-semibold text-gray-900">
                {isReadyToLaunch ? 'Ready to Launch!' : 'Review Required'}
              </h4>
              <p className="text-sm text-gray-600">
                {isReadyToLaunch 
                  ? 'Your campaign is complete and ready to go live.'
                  : 'Please complete all required sections before launching.'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Creator Selection
        </Button>
        <Button 
          onClick={onLaunch}
          disabled={!isReadyToLaunch || isSubmitting}
          className="flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90"
        >
          {isSubmitting ? 'Launching...' : 'Launch Campaign'}
          <Rocket className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ReviewLaunchStep;
