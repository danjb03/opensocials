
import React from 'react';
import { Lightbulb } from 'lucide-react';

export const QuickTips: React.FC = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
        <Lightbulb className="h-4 w-4" />
        Quick Tips
      </h4>
      <ul className="text-sm text-muted-foreground space-y-1">
        <li>• Choose a clear, memorable campaign name that reflects your goal</li>
        <li>• Your objective will help us recommend the best creators for your needs</li>
        <li>• Campaign type determines pricing and creator availability</li>
      </ul>
    </div>
  );
};
