
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type EmptyProjectStateProps = {
  onRefresh: () => void;
  hasFilters: boolean;
};

export const EmptyProjectState: React.FC<EmptyProjectStateProps> = ({ onRefresh, hasFilters }) => {
  return (
    <Card className="w-full h-64 flex items-center justify-center">
      <CardContent className="text-center p-6">
        <h3 className="text-xl font-medium mb-2">No Projects Found</h3>
        <p className="text-muted-foreground mb-4">
          {hasFilters 
            ? `No projects match the selected campaign type filters.` 
            : `There are no projects in the system yet. Once brands create projects, they will appear here.`}
        </p>
        <Button variant="outline" onClick={onRefresh}>
          Refresh
        </Button>
      </CardContent>
    </Card>
  );
};
