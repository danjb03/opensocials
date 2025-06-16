
import React from 'react';
import { Button } from '@/components/ui/button';

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  onPageChange: (page: number) => void;
}

const UserPagination: React.FC<UserPaginationProps> = ({
  currentPage,
  totalPages,
  totalUsers,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages} ({totalUsers} total users)
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="border-border text-foreground hover:bg-accent"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="border-border text-foreground hover:bg-accent"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default UserPagination;
