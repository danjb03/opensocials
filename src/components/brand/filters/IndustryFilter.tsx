
import { useState } from 'react';
import { Command, CommandInput, CommandList, CommandItem } from '@/components/ui/command';
import { industries } from '@/data/industries';

type IndustryFilterProps = {
  industries: string[];
  onIndustriesChange: (industries: string[]) => void;
};

export const IndustryFilter = ({ industries: selectedIndustries, onIndustriesChange }: IndustryFilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  const filteredIndustries = industries.filter(industry => 
    industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectIndustry = (industry: string) => {
    setSelectedIndustry(industry);
    
    // Toggle industry selection
    if (selectedIndustries.includes(industry)) {
      onIndustriesChange(selectedIndustries.filter(i => i !== industry));
    } else {
      onIndustriesChange([...selectedIndustries, industry]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Industries</label>
      <Command className="border rounded-md">
        <CommandInput 
          placeholder="Search industries..." 
          value={searchTerm}
          onValueChange={setSearchTerm}
          className="text-sm"
        />
        <div className="max-h-[300px] overflow-y-auto w-full">
          <CommandList>
            {filteredIndustries.map((industry) => (
              <CommandItem
                key={industry}
                onSelect={() => handleSelectIndustry(industry)}
                className={selectedIndustries.includes(industry) ? "bg-muted text-primary" : ""}
              >
                <span>{industry}</span>
                {selectedIndustries.includes(industry) && (
                  <svg className="h-4 w-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </CommandItem>
            ))}
          </CommandList>
        </div>
      </Command>
    </div>
  );
};
