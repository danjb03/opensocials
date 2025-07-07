
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronDown, X, Search } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

interface Option {
  id: string;
  name: string;
  count?: number;
}

interface MultiSelectFilterProps {
  label: string;
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  maxDisplayItems?: number;
}

export const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search options...",
  className = "",
  maxDisplayItems = 3
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const toggleOption = (optionId: string) => {
    if (selectedValues.includes(optionId)) {
      onChange(selectedValues.filter(v => v !== optionId));
    } else {
      onChange([...selectedValues, optionId]);
    }
  };

  const removeOption = (optionId: string) => {
    onChange(selectedValues.filter(v => v !== optionId));
  };

  const clearAll = () => {
    onChange([]);
  };

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const selectedOptions = options.filter(option => selectedValues.includes(option.id));
  const displayedOptions = selectedOptions.slice(0, maxDisplayItems);
  const remainingCount = selectedOptions.length - maxDisplayItems;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">{label}</h3>
        {selectedValues.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAll}
            className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {displayedOptions.map(option => (
            <Badge
              key={option.id}
              variant="secondary"
              className="font-light"
            >
              {option.name}
              <X 
                className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => removeOption(option.id)}
              />
            </Badge>
          ))}
          {remainingCount > 0 && (
            <Badge variant="outline" className="font-light">
              +{remainingCount} more
            </Badge>
          )}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-light"
          >
            {selectedValues.length > 0 
              ? `${selectedValues.length} selected`
              : placeholder
            }
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput 
              placeholder={searchPlaceholder}
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map(option => (
                  <CommandItem
                    key={option.id}
                    onSelect={() => toggleOption(option.id)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        selectedValues.includes(option.id) ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <span className="font-light">{option.name}</span>
                    {option.count && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {option.count}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
