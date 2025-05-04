
import React from 'react';
import { Input } from '@/components/ui/input';

interface DateRangeSelectorProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => {
  return (
    <div className="flex gap-4">
      <div className="w-1/2">
        <label className="block text-sm font-medium mb-1">Start Date</label>
        <Input 
          type="date" 
          value={startDate} 
          onChange={(e) => onStartDateChange(e.target.value)} 
          required 
          className="w-full"
        />
      </div>
      <div className="w-1/2">
        <label className="block text-sm font-medium mb-1">End Date</label>
        <Input 
          type="date" 
          value={endDate} 
          onChange={(e) => onEndDateChange(e.target.value)} 
          required 
          className="w-full"
        />
      </div>
    </div>
  );
};
