
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Eye, Loader } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Brand {
  brand_id: string;
  company_name: string | null;
  email: string | null;
  industry: string | null;
  budget_range: string | null;
  total_deals: number | null;
  active_deals: number | null;
  last_active_at: string | null;
  status: string | null;
}

interface BrandsTableProps {
  brands: Brand[];
  isLoading: boolean;
}

// Function to render status badge with appropriate color
const StatusBadge = ({ status }: { status: string | null }) => {
  if (!status) return null;
  
  const statusMap: Record<string, { variant: "default" | "outline" | "secondary" | "destructive"; label: string }> = {
    active: { variant: "default", label: "Active" },
    pending: { variant: "secondary", label: "Pending" },
    suspended: { variant: "destructive", label: "Suspended" },
    inactive: { variant: "outline", label: "Inactive" }
  };
  
  const { variant, label } = statusMap[status.toLowerCase()] || { variant: "default", label: status };
  
  return (
    <Badge variant={variant} className={status.toLowerCase() === 'active' ? 'bg-green-600 hover:bg-green-700' : ''}>{label}</Badge>
  );
};

// Format date to relative time
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Never';
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
};

export const BrandsTable = ({ brands, isLoading }: BrandsTableProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader className="animate-spin h-6 w-6 mx-auto mb-4" />
        <p className="text-muted-foreground">Loading brands...</p>
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No brands found. Try adjusting your search or filters.</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden md:table-cell">Industry</TableHead>
            <TableHead className="hidden md:table-cell">Budget Range</TableHead>
            <TableHead className="hidden lg:table-cell">Total Deals</TableHead>
            <TableHead className="hidden lg:table-cell">Active Deals</TableHead>
            <TableHead className="hidden sm:table-cell">Last Active</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.map((brand) => (
            <TableRow key={brand.brand_id}>
              <TableCell className="font-medium">
                {brand.company_name || "Unnamed Brand"}
              </TableCell>
              <TableCell>{brand.email || "No email"}</TableCell>
              <TableCell className="hidden md:table-cell">
                {brand.industry || "Not specified"}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {brand.budget_range || "Not specified"}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {brand.total_deals ?? 0}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {brand.active_deals ?? 0}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {formatDate(brand.last_active_at)}
              </TableCell>
              <TableCell>
                <StatusBadge status={brand.status} />
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  size="sm" 
                  variant="outline" 
                  asChild
                >
                  <Link to={`/admin/crm/brands/${brand.brand_id}`}>
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </span>
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
