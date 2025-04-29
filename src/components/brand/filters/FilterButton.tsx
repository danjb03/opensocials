
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DialogTrigger } from '@/components/ui/dialog';

interface FilterButtonProps {
  activeFilterCount: number;
}

export function FilterButton({ activeFilterCount }: FilterButtonProps) {
  return (
    <DialogTrigger asChild>
      <Button variant="outline" className="flex items-center gap-1.5">
        <Filter className="h-4 w-4" />
        <span className="text-sm">Filter</span>
        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="ml-1 rounded-full px-2 py-0.5 text-xs">
            {activeFilterCount}
          </Badge>
        )}
      </Button>
    </DialogTrigger>
  );
}
