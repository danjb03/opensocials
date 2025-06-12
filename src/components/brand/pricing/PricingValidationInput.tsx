
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, Info } from 'lucide-react';
import { CreatorTier, formatPricingHint, validateOfferAmount } from '@/utils/tierPricing';

interface PricingValidationInputProps {
  value: number;
  onChange: (value: number) => void;
  creatorTier: CreatorTier;
  campaignType: string;
  isAdminOverride?: boolean;
  label?: string;
  error?: string;
  className?: string;
}

export const PricingValidationInput: React.FC<PricingValidationInputProps> = ({
  value,
  onChange,
  creatorTier,
  campaignType,
  isAdminOverride = false,
  label = "Offer Amount",
  error,
  className
}) => {
  const validation = validateOfferAmount(value, creatorTier, campaignType, isAdminOverride);
  const hint = formatPricingHint(creatorTier, campaignType);
  
  const hasValidationError = !validation.isValid && value > 0;
  const displayError = error || (hasValidationError ? validation.errorMessage : '');

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="offer-amount" className="text-sm font-medium text-foreground">
          {label} *
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">{hint}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">£</span>
        <Input
          id="offer-amount"
          type="number"
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder="0"
          className={`pl-8 ${className} ${hasValidationError ? 'border-destructive' : ''}`}
        />
        {hasValidationError && (
          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
        )}
      </div>
      
      {displayError && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {displayError}
        </p>
      )}
      
      {!hasValidationError && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
};
