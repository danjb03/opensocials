
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface OrdersSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const OrdersSearch = ({ searchTerm, onSearchChange }: OrdersSearchProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Search & Filter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search campaigns..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersSearch;
