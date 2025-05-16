
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

type CreatorCRMItem = {
  creator_id: string;
  first_name: string;
  last_name: string;
  email: string;
  primary_platform: string;
  follower_count: string;
  engagement_rate: string;
  status: string;
  total_deals: number;
  active_deals: number;
  last_active_at: string;
};

interface CreatorCRMTableProps {
  creators: CreatorCRMItem[];
}

export function CreatorCRMTable({ creators }: CreatorCRMTableProps) {
  if (!creators || creators.length === 0) {
    return <p className="text-gray-500 text-center py-8">No creators found.</p>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Followers</TableHead>
            <TableHead>Engagement</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Deals</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {creators.map((creator) => (
            <TableRow key={creator.creator_id}>
              <TableCell>
                <Link to={`/admin/crm/creators/${creator.creator_id}`} className="hover:underline text-blue-600">
                  {creator.first_name} {creator.last_name}
                </Link>
              </TableCell>
              <TableCell>{creator.email}</TableCell>
              <TableCell>{creator.primary_platform}</TableCell>
              <TableCell>{creator.follower_count}</TableCell>
              <TableCell>{creator.engagement_rate}</TableCell>
              <TableCell>
                <Badge variant={creator.status === 'active' ? 'default' : 'outline'}>
                  {creator.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {creator.active_deals}/{creator.total_deals}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
