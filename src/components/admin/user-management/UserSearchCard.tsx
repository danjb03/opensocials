
import React from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface UserSearchCardProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const UserSearchCard: React.FC<UserSearchCardProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <Card className="mb-6 bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Search Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by email, ID, or name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-background border-border text-foreground"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSearchCard;
