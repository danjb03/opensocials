
import React from 'react';
import { UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface EvergreenTimelineProps {
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  errors: FieldErrors<any>;
}

export const EvergreenTimeline: React.FC<EvergreenTimelineProps> = ({
  setValue,
  watch,
  errors
}) => {
  const rollingBasis = watch('rolling_basis');
  const monthlyBudgetCap = watch('monthly_budget_cap');
  const scalingTriggers = watch('scaling_triggers') || [];

  const addScalingTrigger = () => {
    const currentTriggers = scalingTriggers || [];
    setValue('scaling_triggers', [...currentTriggers, '']);
  };

  const updateScalingTrigger = (index: number, value: string) => {
    const currentTriggers = scalingTriggers || [];
    const updatedTriggers = [...currentTriggers];
    updatedTriggers[index] = value;
    setValue('scaling_triggers', updatedTriggers);
  };

  const removeScalingTrigger = (index: number) => {
    const currentTriggers = scalingTriggers || [];
    setValue('scaling_triggers', currentTriggers.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rolling-basis"
              checked={rollingBasis}
              onCheckedChange={(checked) => setValue('rolling_basis', checked)}
            />
            <Label htmlFor="rolling-basis" className="text-sm font-medium text-foreground">
              Post on rolling basis
            </Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Monthly Budget Cap (Optional)</Label>
          <Input
            type="number"
            min="0"
            value={monthlyBudgetCap || ''}
            onChange={(e) => setValue('monthly_budget_cap', parseFloat(e.target.value) || 0)}
            placeholder="e.g., 5000"
            className="bg-background border-border text-foreground"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Scaling/Pausing Triggers</Label>
        <div className="space-y-2">
          {scalingTriggers.map((trigger: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={trigger}
                onChange={(e) => updateScalingTrigger(index, e.target.value)}
                placeholder="e.g., ROI drops below 2x"
                className="bg-background border-border text-foreground flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeScalingTrigger(index)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addScalingTrigger}
            className="bg-background border-border text-foreground"
          >
            Add Trigger
          </Button>
        </div>
      </div>
    </div>
  );
};
