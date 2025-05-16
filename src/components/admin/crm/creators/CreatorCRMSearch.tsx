
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface CreatorCRMSearchProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

export function CreatorCRMSearch({ onSearch, initialValue = '' }: CreatorCRMSearchProps) {
  const [search, setSearch] = useState(initialValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(search);
    }, 400);
    
    return () => clearTimeout(timeout);
  }, [search, onSearch]);

  return (
    <Input
      placeholder="Search creators..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-[300px]"
    />
  );
}
