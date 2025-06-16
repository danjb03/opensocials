
import React from 'react';
import { Lightbulb } from 'lucide-react';
import { CampaignWizardData } from '@/types/campaignWizard';

interface InvestmentSummaryProps {
  data: Partial<CampaignWizardData>;
}

export const InvestmentSummary: React.FC<InvestmentSummaryProps> = ({ data }) => {
  const totalBudget = data.total_budget || 0;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground">Campaign Investment</h3>
      <div className="bg-muted rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-foreground">Total Campaign Cost:</span>
          <span className="text-2xl font-bold text-foreground">${totalBudget.toFixed(2)}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          All-inclusive campaign cost covering creator payments and full campaign support.
        </p>
      </div>
      <div className="text-xs text-muted-foreground bg-blue-950/20 border border-blue-800/20 p-3 rounded-lg flex items-start gap-2">
        <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-400" />
        <span className="text-foreground"><strong>Rolling Creator System:</strong> You can invite additional creators later if some decline or if you want to expand reach, using your remaining budget pool.</span>
      </div>
    </div>
  );
};
