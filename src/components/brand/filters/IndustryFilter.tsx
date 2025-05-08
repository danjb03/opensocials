
import React, { useState } from 'react';
import { Check, X, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { industries } from '@/data/industries';

interface IndustryFilterProps {
  industries: string[];
  onIndustriesChange: (industries: string[]) => void;
}

export function IndustryFilter({ industries: selectedIndustries, onIndustriesChange }: IndustryFilterProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (industry: string) => {
    if (selectedIndustries.includes(industry)) {
      onIndustriesChange(selectedIndustries.filter((i) => i !== industry));
    } else {
      onIndustriesChange([...selectedIndustries, industry]);
    }
  };

  const handleRemove = (industry: string) => {
    onIndustriesChange(selectedIndustries.filter((i) => i !== industry));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Industries</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedIndustries.length > 0
              ? `${selectedIndustries.length} selected`
              : "Select industries..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search industries..." />
            <CommandEmpty>No industry found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {industries.map((industry) => (
                <CommandItem
                  key={industry}
                  value={industry}
                  onSelect={() => handleSelect(industry)}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selectedIndustries.includes(industry) ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {industry}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedIndustries.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedIndustries.map((industry) => (
            <Badge key={industry} variant="secondary" className="flex items-center gap-1">
              {industry}
              <button
                className="ml-1 rounded-full outline-none"
                onClick={() => handleRemove(industry)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
