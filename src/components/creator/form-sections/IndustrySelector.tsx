
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { industries } from '@/data/industries';

interface IndustrySelectorProps {
  selectedIndustries: string[];
  setSelectedIndustries: (industries: string[]) => void;
}

export function IndustrySelector({ selectedIndustries, setSelectedIndustries }: IndustrySelectorProps) {
  const [customIndustry, setCustomIndustry] = React.useState('');

  const handleIndustrySelect = (industry: string) => {
    if (industry && !selectedIndustries.includes(industry)) {
      setSelectedIndustries([...selectedIndustries, industry]);
    }
  };

  const handleCustomIndustryAdd = () => {
    if (customIndustry.trim() && !selectedIndustries.includes(customIndustry.trim())) {
      setSelectedIndustries([...selectedIndustries, customIndustry.trim()]);
      setCustomIndustry('');
    }
  };

  const removeIndustry = (industry: string) => {
    setSelectedIndustries(selectedIndustries.filter(i => i !== industry));
  };

  return (
    <div className="space-y-3">
      <Label>Industries *</Label>
      <div className="flex gap-2">
        <Select onValueChange={handleIndustrySelect}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select an industry" />
          </SelectTrigger>
          <SelectContent>
            {industries.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2">
        <Input
          value={customIndustry}
          onChange={(e) => setCustomIndustry(e.target.value)}
          placeholder="Or add a custom industry..."
          className="flex-1"
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleCustomIndustryAdd}
          disabled={!customIndustry.trim()}
        >
          Add
        </Button>
      </div>

      {selectedIndustries.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedIndustries.map((industry) => (
            <div 
              key={industry}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm"
            >
              {industry}
              <button
                type="button"
                onClick={() => removeIndustry(industry)}
                className="ml-1 rounded-full hover:bg-primary-foreground/20"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
