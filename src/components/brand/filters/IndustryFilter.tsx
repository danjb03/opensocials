
import React, { useState } from 'react';
import { Check, X, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { industries, industryCategories } from '@/data/industries';

interface IndustryFilterProps {
  industries: string[];
  onIndustriesChange: (industries: string[]) => void;
  maxSelections?: number;
}

export function IndustryFilter({ 
  industries: selectedIndustries, 
  onIndustriesChange,
  maxSelections = 5 
}: IndustryFilterProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (industry: string) => {
    if (selectedIndustries.includes(industry)) {
      onIndustriesChange(selectedIndustries.filter((i) => i !== industry));
    } else {
      if (selectedIndustries.length >= maxSelections) {
        // If already at max, replace the first selected industry
        onIndustriesChange([...selectedIndustries.slice(1), industry]);
      } else {
        onIndustriesChange([...selectedIndustries, industry]);
      }
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
            <CommandList className="max-h-[300px]">
              {selectedIndustries.length > 0 && (
                <>
                  <CommandGroup heading="Selected">
                    {selectedIndustries.map((industry) => (
                      <CommandItem
                        key={`selected-${industry}`}
                        value={`selected-${industry}`}
                        onSelect={() => handleSelect(industry)}
                        className="justify-between"
                      >
                        {industry}
                        <Check className="h-4 w-4 opacity-100" />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}
              
              {industryCategories.map((category) => (
                <CommandGroup key={category.name} heading={category.name}>
                  {category.industries.map((industry) => {
                    const isSelected = selectedIndustries.includes(industry);
                    return (
                      <CommandItem
                        key={industry}
                        value={industry}
                        onSelect={() => handleSelect(industry)}
                        disabled={selectedIndustries.length >= maxSelections && !isSelected}
                      >
                        <div className="flex items-center">
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              isSelected ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          {industry}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ))}
              
              {selectedIndustries.length >= maxSelections && (
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  Maximum {maxSelections} industries can be selected
                </div>
              )}
            </CommandList>
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
                type="button"
                aria-label={`Remove ${industry}`}
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
