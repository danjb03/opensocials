
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RevenueControlsProps {
  timeFrame: 'daily' | 'weekly' | 'monthly';
  setTimeFrame: (value: 'daily' | 'weekly' | 'monthly') => void;
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
}

const RevenueControls = ({ timeFrame, setTimeFrame, selectedMonth, setSelectedMonth }: RevenueControlsProps) => {
  // Generate month options for the dropdown
  const generateMonthOptions = () => {
    const options = [];
    const now = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      options.push({ value, label });
    }
    
    return options;
  };

  const monthOptions = generateMonthOptions();

  return (
    <div className="flex flex-wrap gap-4 items-center justify-between">
      <h2 className="text-2xl font-bold text-foreground">Revenue Analytics</h2>
      <div className="flex gap-4">
        <Select value={timeFrame} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setTimeFrame(value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default RevenueControls;
