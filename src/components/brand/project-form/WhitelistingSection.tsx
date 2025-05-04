
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface WhitelistingSectionProps {
  whitelisting: boolean;
  exclusivity: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onWhitelistingToggle: () => void;
}

export const WhitelistingSection: React.FC<WhitelistingSectionProps> = ({
  whitelisting,
  exclusivity,
  onChange,
  onWhitelistingToggle
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p className="font-medium mb-2">Whitelisting</p>
        <Button
          type="button"
          variant={whitelisting ? 'default' : 'outline'}
          onClick={onWhitelistingToggle}
          className={whitelisting ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          {whitelisting ? 'Yes' : 'No'}
        </Button>
      </div>
      <div>
        <p className="font-medium mb-2">Exclusivity</p>
        <Input
          placeholder="e.g. 3 months"
          name="exclusivity"
          value={exclusivity}
          onChange={onChange}
          className="border-slate-300 focus-visible:ring-blue-500"
        />
      </div>
    </div>
  );
};
