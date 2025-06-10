
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface MonthYearFilterProps {
  month: string;
  year: string;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
}

export const monthOptions = [
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

export function getYearOptions() {
  const currentYear = new Date().getFullYear();
  const years = [{ value: 'all', label: 'All Years' }];
  for (let year = currentYear - 2; year <= currentYear + 2; year++) {
    years.push({ value: year.toString(), label: year.toString() });
  }
  return years;
}

export function MonthYearFilter({ month, year, onMonthChange, onYearChange }: MonthYearFilterProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Month Started</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Select value={month || 'all'} onValueChange={onMonthChange}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-sm">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={year || 'all'} onValueChange={onYearChange}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {getYearOptions().map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-sm">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
