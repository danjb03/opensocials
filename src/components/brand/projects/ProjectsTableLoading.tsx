
import React from 'react';

export const ProjectsTableLoading = React.memo(() => {
  return (
    <div className="text-center py-12">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-8 w-1/4 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2.5"></div>
        <div className="h-4 w-2/3 bg-gray-200 rounded mb-2.5"></div>
        <div className="h-4 w-3/5 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
});

ProjectsTableLoading.displayName = 'ProjectsTableLoading';
