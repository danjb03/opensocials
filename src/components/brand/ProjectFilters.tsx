
import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { campaignTypeOptions } from '@/types/projects';

export type ProjectFilters = {
  campaignTypes: string[];
  platforms: string[];
  campaignName: string;
  startMonth: string | null;
};

const platformOptions = ['TikTok', 'Instagram', 'YouTube', 'Twitter', 'Facebook'];

// Fixed monthOptions to include proper value for "All Months"
const monthOptions = [
  { value: 'all', label: 'All Months' },
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const yearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear - 2; year <= currentYear + 2; year++) {
    years.push({ value: year.toString(), label: year.toString() });
  }
  return years;
};

type ProjectFiltersProps = {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
};

export function ProjectFilters({ filters, onFiltersChange }: ProjectFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<ProjectFilters>(filters);
  // Default to 'all' instead of empty string
  const [month, setMonth] = useState('all');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  
  // Set month/year from startMonth when dialog opens
  useEffect(() => {
    if (filters.startMonth) {
      const [yearPart, monthPart] = filters.startMonth.split('-');
      setYear(yearPart);
      setMonth(monthPart);
    } else {
      // Use 'all' instead of empty string
      setMonth('all');
      setYear(new Date().getFullYear().toString());
    }
    
    setLocalFilters(filters);
  }, [filters, isOpen]);

  const handleTogglePlatform = (platform: string) => {
    setLocalFilters(prev => {
      const platforms = prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform];
      return { ...prev, platforms };
    });
  };

  const handleApplyFilters = () => {
    // Only set startMonth if a specific month is selected (not "All Months")
    const startMonth = month !== 'all' ? `${year}-${month}` : null;
    onFiltersChange({ ...localFilters, startMonth });
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    const emptyFilters: ProjectFilters = {
      campaignTypes: [],
      platforms: [],
      campaignName: '',
      startMonth: null
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    setIsOpen(false);
  };

  const activeFilterCount = [
    filters.campaignTypes.length > 0,
    filters.platforms.length > 0,
    filters.campaignName ? true : false,
    filters.startMonth ? true : false
  ].filter(Boolean).length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1.5">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 rounded-full px-2 py-0.5 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filter Projects</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Campaign Type Filter */}
          <div className="space-y-2">
            <h3 className="font-medium">Campaign Duration</h3>
            <ToggleGroup 
              type="multiple" 
              className="flex flex-wrap gap-2 justify-start"
              value={localFilters.campaignTypes}
              onValueChange={(values) => setLocalFilters(prev => ({ ...prev, campaignTypes: values }))}
            >
              {campaignTypeOptions.map((type) => (
                <ToggleGroupItem 
                  key={type} 
                  value={type} 
                  className="rounded-md text-sm px-3 py-1"
                >
                  {type}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* Platforms Filter */}
          <div className="space-y-3">
            <h3 className="font-medium">Platforms</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {platformOptions.map((platform) => (
                <div key={platform} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`platform-${platform}`} 
                    checked={localFilters.platforms.includes(platform)}
                    onCheckedChange={() => handleTogglePlatform(platform)}
                  />
                  <Label htmlFor={`platform-${platform}`}>{platform}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Campaign Name Filter */}
          <div className="space-y-2">
            <Label htmlFor="campaign-name">Campaign Name</Label>
            <Input
              id="campaign-name"
              value={localFilters.campaignName}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, campaignName: e.target.value }))}
              placeholder="Search by name..."
            />
          </div>

          {/* Month Started Filter */}
          <div className="space-y-2">
            <h3 className="font-medium">Month Started</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleClearFilters}>
            Clear Filters
          </Button>
          <Button onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
