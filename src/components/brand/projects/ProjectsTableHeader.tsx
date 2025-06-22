
import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { Calendar, DollarSign, Users, BarChart2 } from 'lucide-react';

export const ProjectsTableHeader = React.memo(() => {
  return (
    <TableHeader>
      <TableRow className="bg-black border-gray-800">
        <TableHead className="font-semibold text-white">Project</TableHead>
        <TableHead className="font-semibold text-white">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Timeline</span>
          </div>
        </TableHead>
        <TableHead className="font-semibold text-white">
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>Budget</span>
          </div>
        </TableHead>
        <TableHead className="font-semibold text-white">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Creators</span>
          </div>
        </TableHead>
        <TableHead className="font-semibold text-white">Status</TableHead>
        <TableHead className="font-semibold text-white">
          <div className="flex items-center gap-1">
            <BarChart2 className="h-4 w-4" />
            <span>Performance</span>
          </div>
        </TableHead>
        <TableHead className="text-right text-white">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
});

ProjectsTableHeader.displayName = 'ProjectsTableHeader';
