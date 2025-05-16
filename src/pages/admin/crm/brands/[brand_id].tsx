
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Building, DollarSign, Briefcase, Clock, Calendar } from 'lucide-react';
import AdminCRMLayout from '@/components/layouts/AdminCRMLayout';
import { formatDistanceToNow, format } from 'date-fns';

// Brand data interface
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
  created_at: string | null;
}

const BrandDetailPage = () => {
  const { brand_id } = useParams<{ brand_id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Fetch brand details from the database directly
  const fetchBrandDetails = async () => {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) {
      throw new Error('Authentication required');
    }
    
    // Fetch the brand data
    const { data, error } = await supabase
      .from('admin_crm_brands_view')
      .select('*')
      .eq('brand_id', brand_id)
      .single();
      
    if (error) {
      console.error('Error fetching brand details:', error);
      throw new Error(error.message);
    }
    
    return data as Brand;
  };
  
  // Query hook for data fetching
  const { data: brand, error, isLoading } = useQuery({
    queryKey: ['adminBrandDetail', brand_id],
    queryFn: fetchBrandDetails,
    enabled: !!brand_id,
  });
  
  if (error) {
    toast({
      title: 'Error fetching brand details',
      description: error instanceof Error ? error.message : 'An unknown error occurred',
      variant: 'destructive'
    });
  }
  
  // Function to render status badge
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
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return format(date, 'PPP');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Format relative time
  const formatRelativeTime = (dateString: string | null) => {
    if (!dateString) return 'Never';
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  return (
    <AdminCRMLayout>
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/crm/brands')}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Brands
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-8">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-1/6" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : brand ? (
        <>
          <Card className="mb-6">
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-2xl">{brand.company_name || 'Unnamed Brand'}</CardTitle>
                <div className="mt-2 flex items-center space-x-2">
                  <StatusBadge status={brand.status} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </h3>
                    <p>{brand.email || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                      <Building className="mr-2 h-4 w-4" />
                      Industry
                    </h3>
                    <p>{brand.industry || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Budget Range
                    </h3>
                    <p>{brand.budget_range || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Deal Statistics
                    </h3>
                    <p>
                      <span className="font-medium">{brand.active_deals || 0}</span> active deals
                      {' '}(<span className="font-medium">{brand.total_deals || 0}</span> total)
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      Last Active
                    </h3>
                    <p>{formatRelativeTime(brand.last_active_at)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Created At
                    </h3>
                    <p>{formatDate(brand.created_at)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* We can add more sections here like recent activity, projects, etc. */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No recent activity available.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No projects available.
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Brand Not Found</h2>
              <p className="text-muted-foreground">
                The brand you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button
                className="mt-4"
                onClick={() => navigate('/admin/crm/brands')}
              >
                Return to Brand List
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </AdminCRMLayout>
  );
};

export default BrandDetailPage;
