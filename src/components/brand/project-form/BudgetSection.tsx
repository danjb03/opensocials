
import React from 'react';
import { Input } from '@/components/ui/input';

interface BudgetSectionProps {
  budget: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BudgetSection: React.FC<BudgetSectionProps> = ({ budget, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Budget</label>
      <Input
        type="number"
        placeholder="Budget"
        name="budget"
        value={budget}
        onChange={onChange}
        required
        className="border-slate-300 focus-visible:ring-blue-500"
      />
    </div>
  );
};
