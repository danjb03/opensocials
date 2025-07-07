
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RangeFilterProps {
  label: string;
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export const RangeFilter: React.FC<RangeFilterProps> = ({
  label,
  min,
  max,
  value,
  onChange,
  step = 1,
  formatValue = (v) => v.toString(),
  className = ""
}) => {
  const handleSliderChange = (newValue: number[]) => {
    onChange([newValue[0], newValue[1]]);
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.max(min, Math.min(Number(e.target.value) || min, value[1]));
    onChange([newMin, value[1]]);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.min(max, Math.max(Number(e.target.value) || max, value[0]));
    onChange([value[0], newMax]);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      
      <div className="px-2">
        <Slider
          value={value}
          onValueChange={handleSliderChange}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground">Min</Label>
          <Input
            type="number"
            value={value[0]}
            onChange={handleMinInputChange}
            min={min}
            max={value[1]}
            className="text-xs font-light"
          />
        </div>
        
        <div className="text-muted-foreground">-</div>
        
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground">Max</Label>
          <Input
            type="number"
            value={value[1]}
            onChange={handleMaxInputChange}
            min={value[0]}
            max={max}
            className="text-xs font-light"
          />
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground text-center font-light">
        {formatValue(value[0])} - {formatValue(value[1])}
      </div>
    </div>
  );
};
