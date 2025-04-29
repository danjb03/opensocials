
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CampaignNameFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function CampaignNameFilter({ value, onChange }: CampaignNameFilterProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="campaign-name" className="text-sm">Campaign Name</Label>
      <Input
        id="campaign-name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name..."
        className="text-sm"
      />
    </div>
  );
}
