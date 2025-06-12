
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AgencyProjectManagement = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Briefcase className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Project Management</h1>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4">
            Start managing projects for your clients.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create First Project
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgencyProjectManagement;
