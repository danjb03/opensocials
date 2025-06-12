
export type CreatorTier = 'Nano' | 'Micro' | 'Mid' | 'Macro' | 'Large' | 'Celebrity';
export type CampaignType = 'Single' | 'Weekly' | 'Monthly' | '12-Month Retainer' | 'Evergreen';

export const MINIMUM_PRICES: Record<CreatorTier, Record<string, number>> = {
  Nano: { Single: 300, Weekly: 750, Monthly: 1500, 'Retainer': 10000, Evergreen: 2000 },
  Micro: { Single: 500, Weekly: 1000, Monthly: 2000, 'Retainer': 12000, Evergreen: 2500 },
  Mid: { Single: 1000, Weekly: 2000, Monthly: 4000, 'Retainer': 15000, Evergreen: 4000 },
  Macro: { Single: 2000, Weekly: 4000, Monthly: 6000, 'Retainer': 20000, Evergreen: 6000 },
  Large: { Single: 4000, Weekly: 6000, Monthly: 10000, 'Retainer': 30000, Evergreen: 8000 },
  Celebrity: { Single: 10000, Weekly: 15000, Monthly: 25000, 'Retainer': 75000, Evergreen: 15000 }
};

export const getMinimumPrice = (tier: CreatorTier, campaignType: string): number => {
  const tierPricing = MINIMUM_PRICES[tier];
  if (!tierPricing) return 0;
  
  // Handle different campaign type formats
  const normalizedType = campaignType === '12-Month Retainer' ? 'Retainer' : campaignType;
  return tierPricing[normalizedType] || 0;
};

export const validateOfferAmount = (
  amount: number, 
  tier: CreatorTier, 
  campaignType: string,
  isAdminOverride: boolean = false
): { isValid: boolean; errorMessage?: string; minimumAmount?: number } => {
  if (isAdminOverride) {
    return { isValid: true };
  }

  const minimumAmount = getMinimumPrice(tier, campaignType);
  
  if (amount < minimumAmount) {
    return {
      isValid: false,
      errorMessage: `Offer must meet the minimum value for this creator's tier and campaign type.`,
      minimumAmount
    };
  }

  return { isValid: true, minimumAmount };
};

export const formatPricingHint = (tier: CreatorTier, campaignType: string): string => {
  const minimumAmount = getMinimumPrice(tier, campaignType);
  return `Minimum for ${campaignType} at ${tier} level is £${minimumAmount.toLocaleString()}`;
};
