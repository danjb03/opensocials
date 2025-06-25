
import { Badge } from '@/components/ui/badge';
import { UploadItem } from './types';

interface UploadStatusBadgeProps {
  upload: UploadItem;
}

export const UploadStatusBadge = ({ upload }: UploadStatusBadgeProps) => {
  // If there's proof, it's been posted
  if (upload.proof) {
    return (
      <Badge className="bg-green-100 text-green-800">
        Posted
      </Badge>
    );
  }

  switch (upload.status) {
    case 'approved':
      return (
        <Badge className="bg-green-100 text-green-800">
          Approved - Post Required
        </Badge>
      );
    case 'revision_requested':
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          Revision Requested {upload.revision_count ? `(${upload.revision_count}/2)` : ''}
        </Badge>
      );
    case 'rejected':
      return (
        <Badge className="bg-red-100 text-red-800">
          Rejected
        </Badge>
      );
    case 'submitted':
    default:
      return (
        <Badge className="bg-blue-100 text-blue-800">
          Under Review
        </Badge>
      );
  }
};
