
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RevenueControlsProps {
  timeFrame: 'daily' | 'weekly' | 'monthly';
  setTimeFrame: (value: 'daily' | 'weekly' | 'monthly') => void;
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
}

const RevenueControls = ({ timeFrame, setTimeFrame, selectedMonth, setSelectedMonth }: RevenueControlsProps) => {
  // Generate month options for 2025
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Generate all 12 months of 2025
    for (let i = 0; i < 12; i++) {
      const date = new Date(2025, i, 1);
      const value = `2025-${String(i + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      
      // Only include months up to current month if we're in 2025
      // If we're before 2025, include all months
      // If we're after 2025, include all months
      const shouldInclude = currentYear !== 2025 || i <= currentMonth;
      
      if (shouldInclude) {
        options.push({ value, label });
      }
    }
    
    // Add previous year months if we're in 2025
    if (currentYear >= 2025) {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(2024, i, 1);
        const value = `2024-${String(i + 1).padStart(2, '0')}`;
        const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        options.unshift({ value, label });
      }
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
