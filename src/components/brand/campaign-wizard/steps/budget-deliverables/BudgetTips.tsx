
import React from 'react';
import { Lightbulb } from 'lucide-react';

export const BudgetTips: React.FC = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
        <Lightbulb className="h-4 w-4" />
        Budget Tips
      </h4>
      <ul className="text-sm text-muted-foreground space-y-1">
        <li>• Higher budgets attract premium creators with larger audiences</li>
        <li>• Consider your cost per engagement when setting budgets</li>
        <li>• Longer campaigns often provide better value and engagement</li>
      </ul>
    </div>
  );
};
