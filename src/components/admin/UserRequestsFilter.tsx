
import React from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserRequestsFilterProps {
  filter: string;
  searchTerm: string;
  onFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export const UserRequestsFilter = ({
  filter,
  searchTerm,
  onFilterChange,
  onSearchChange,
}: UserRequestsFilterProps) => {
  return (
    <div className="space-y-4">
      <Input 
        placeholder="Search users..." 
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-md"
      />
      <Tabs value={filter} onValueChange={onFilterChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
          <TabsTrigger value="approved">Approved Users</TabsTrigger>
          <TabsTrigger value="declined">Declined Requests</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
