
import React from 'react';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Users } from 'lucide-react';

const BrandCreators = () => {
  return (
    <BrandLayout>
      <div className="container mx-auto p-6 bg-background">
        <div className="mb-6">
          <h1 className="text-3xl font-light text-foreground mb-2">Creators</h1>
          <p className="text-muted-foreground">Find and manage creator partnerships</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Users className="h-5 w-5" />
              Creator Directory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Creator Search Coming Soon
              </h3>
              <p className="text-muted-foreground mb-6">
                We're building an amazing creator discovery experience for you.
              </p>
              <Button variant="outline">
                Get Notified When Ready
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </BrandLayout>
  );
};

export default BrandCreators;
