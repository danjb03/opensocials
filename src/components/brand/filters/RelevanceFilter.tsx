
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface RelevanceFilterProps {
  value: number;
  onChange: (value: number) => void;
}

export function RelevanceFilter({ value, onChange }: RelevanceFilterProps) {
  return (
    <div className="space-y-4 opacity-60">
      <div className="flex justify-between items-center">
        <Label htmlFor="relevance" className="text-sm flex items-center">
          Minimum Relevance Score 
          <span className="ml-2 text-xs bg-secondary px-2 py-0.5 rounded-full">Coming soon</span>
        </Label>
        <span className="text-sm font-medium">{value}%</span>
      </div>
      <Slider
        id="relevance"
        defaultValue={[value]}
        max={100}
        step={5}
        onValueChange={(values) => onChange(values[0])}
        className="py-2"
        disabled={true}
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>Lower Match</span>
        <span>Higher Match</span>
      </div>
    </div>
  );
}
