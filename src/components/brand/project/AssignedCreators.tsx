
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';

interface AssignedCreatorsProps {
  onNavigateToCreatorSearch: () => void;
}

export const AssignedCreators: React.FC<AssignedCreatorsProps> = ({ onNavigateToCreatorSearch }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="text-xl">Assigned Creators</CardTitle>
      </CardHeader>
      <CardContent className="py-6">
        <div className="text-center text-gray-500">
          <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p>No creators assigned yet</p>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm">
                <Users className="mr-2 h-4 w-4" /> Find Creators
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Find Creators for this Campaign</SheetTitle>
                <SheetDescription>
                  Browse our creator marketplace and connect with the perfect talent for your campaign.
                </SheetDescription>
              </SheetHeader>
              <div className="py-6">
                <p className="text-center text-gray-500">
                  Creator matching functionality will be implemented soon.
                </p>
                <Button 
                  className="w-full mt-4 shadow-sm"
                  onClick={onNavigateToCreatorSearch}
                >
                  Go to Creator Search
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </CardContent>
    </Card>
  );
};
