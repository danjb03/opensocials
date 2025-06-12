
import React from 'react';

export const PricingWarning: React.FC = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <p className="text-sm text-muted-foreground">
        Loading pricing validation for selected creators...
      </p>
    </div>
  );
};
