
export interface PricingError {
  minPrice: number;
  campaignType: string;
  tier: string;
}

export const parsePricingError = (errorMessage: string): PricingError | null => {
  // Match the pattern: "Offer amount (£X) is below the minimum (£Y) for tier Z and campaign type ABC"
  const regex = /Offer amount \(£(\d+(?:\.\d+)?)\) is below the minimum \(£(\d+(?:\.\d+)?)\) for tier (\w+) and campaign type ([^"]+)/;
  const match = errorMessage.match(regex);
  
  if (match) {
    return {
      minPrice: parseFloat(match[2]),
      campaignType: match[4],
      tier: match[3]
    };
  }
  
  return null;
};

export const isPricingError = (errorMessage: string): boolean => {
  return errorMessage.includes('Offer amount (£') || 
         errorMessage.includes('below the minimum') ||
         errorMessage.includes('pricing tier');
};
