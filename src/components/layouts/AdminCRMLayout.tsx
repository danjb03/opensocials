
import { ReactNode } from 'react';
import { useAuth } from '@/lib/auth';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './AdminLayout';

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
    <AdminLayout>
      <div className="container mx-auto py-8">
        {children}
      </div>
    </AdminLayout>
  );
};

export default AdminCRMLayout;
