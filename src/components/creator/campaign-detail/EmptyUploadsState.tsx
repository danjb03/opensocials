
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface EmptyUploadsStateProps {
  isCompleted: boolean;
  onUploadClick: () => void;
}

export const EmptyUploadsState = ({ isCompleted, onUploadClick }: EmptyUploadsStateProps) => {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center justify-center text-center">
        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium mb-1">No Uploads Yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          You haven't uploaded any content for this campaign yet.
        </p>
        {!isCompleted && (
          <Button onClick={onUploadClick}>
            Upload Content
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
