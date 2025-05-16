
import { ReactNode } from 'react';
import { useAuth } from '@/lib/auth';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AdminCRMLayoutProps {
  children: ReactNode;
}

const AdminCRMLayout = ({ children }: AdminCRMLayoutProps) => {
  const { user, role } = useAuth();
  const { toast } = useToast();

  // Verify admin permissions
  if (!user || (role !== 'admin' && role !== 'super_admin')) {
    toast({
      title: 'Access Denied',
      description: 'Only admins can access this page.',
      variant: 'destructive',
    });
    return <Navigate to="/" replace />;
  }

  return (
    // Removed the AdminLayout wrapper since it's now redundant
    // This prevents duplicate menus from showing
    <div className="container mx-auto py-8">
      {children}
    </div>
  );
};

export default AdminCRMLayout;
