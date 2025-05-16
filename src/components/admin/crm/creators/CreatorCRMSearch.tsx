
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface CreatorCRMSearchProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

export function CreatorCRMSearch({ onSearch, initialValue = '' }: CreatorCRMSearchProps) {
  const [search, setSearch] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  // Update local state when initialValue changes
  useEffect(() => {
    setSearch(initialValue);
    setDebouncedValue(initialValue);
  }, [initialValue]);

  // Debounce effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== debouncedValue) {
        setDebouncedValue(search);
        onSearch(search);
      }
    }, 400);
    
    return () => clearTimeout(timeout);
  }, [search, debouncedValue, onSearch]);

  return (
    <Input
      placeholder="Search creators..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-[300px]"
    />
  );
}
