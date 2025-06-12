
import React from 'react';
import { FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Zap, Target, ShoppingCart, Heart, TrendingUp } from 'lucide-react';
import { CampaignObjective } from '@/types/campaignWizard';

const objectiveOptions = [{
  value: 'brand_awareness' as CampaignObjective,
  label: 'Brand Awareness',
  description: 'Increase visibility and recognition of your brand',
  icon: <Zap className="h-5 w-5" />
}, {
  value: 'product_launch' as CampaignObjective,
  label: 'Product Launch',
  description: 'Introduce a new product or service to the market',
  icon: <Target className="h-5 w-5" />
}, {
  value: 'sales_drive' as CampaignObjective,
  label: 'Sales Drive',
  description: 'Drive direct sales and conversions',
  icon: <ShoppingCart className="h-5 w-5" />
}, {
  value: 'engagement' as CampaignObjective,
  label: 'Engagement',
  description: 'Boost interactions and community building',
  icon: <Heart className="h-5 w-5" />
}, {
  value: 'conversions' as CampaignObjective,
  label: 'Conversions',
  description: 'Drive specific actions like sign-ups or downloads',
  icon: <TrendingUp className="h-5 w-5" />
}];

interface ObjectiveSelectorProps {
  value: CampaignObjective | undefined;
  onChange: (value: CampaignObjective) => void;
  errors: FieldErrors<any>;
}

export const ObjectiveSelector: React.FC<ObjectiveSelectorProps> = ({
  value,
  onChange,
  errors
}) => {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-foreground">
        What's your main objective? *
      </Label>
      <RadioGroup 
        value={value} 
        onValueChange={onChange} 
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {objectiveOptions.map(option => (
          <Label 
            key={option.value} 
            htmlFor={option.value} 
            className={`
              flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all
              ${value === option.value 
                ? 'border-foreground bg-card' 
                : 'border-border hover:border-foreground bg-card'
              }
            `}
          >
            <RadioGroupItem id={option.value} value={option.value} className="mt-1" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-foreground">{option.icon}</span>
                <span className="font-medium text-foreground">{option.label}</span>
              </div>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
          </Label>
        ))}
      </RadioGroup>
      {errors.objective && (
        <p className="text-sm text-destructive">{String(errors.objective.message || 'Please select an objective')}</p>
      )}
    </div>
  );
};
