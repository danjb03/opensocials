
import React from 'react';
import { Input } from '@/components/ui/input';
import { DollarSign } from 'lucide-react';

interface BudgetSectionProps {
  budget: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BudgetSection: React.FC<BudgetSectionProps> = ({ budget, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-700">Budget</label>
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <DollarSign className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="number"
          placeholder="Campaign Budget"
          name="budget"
          value={budget}
          onChange={onChange}
          required
          className="pl-10 border-slate-300 focus-visible:ring-blue-500 focus-visible:border-blue-500"
        />
      </div>
    </div>
  );
};
