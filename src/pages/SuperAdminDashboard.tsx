
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import AdminLayout from "@/components/layouts/AdminLayout";

const SuperAdminDashboard = () => {
  const { user, role, isLoading } = useUnifiedAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || role !== 'super_admin')) {
      navigate('/auth');
    }
  }, [user, role, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-background text-foreground">
        <div className="space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Super Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to the super admin dashboard. You have access to all system functions.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 border border-border rounded-lg bg-card">
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">User Management</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage all users across agencies, brands, and creators
              </p>
              <button 
                onClick={() => navigate('/super-admin/users/agencies')}
                className="text-sm text-primary hover:text-primary/80 hover:underline"
              >
                View Users →
              </button>
            </div>
            
            <div className="p-6 border border-border rounded-lg bg-card">
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">System Overview</h3>
              <p className="text-sm text-muted-foreground mb-4">
                View system-wide analytics and health
              </p>
              <button 
                onClick={() => navigate('/admin')}
                className="text-sm text-primary hover:text-primary/80 hover:underline"
              >
                View Admin Dashboard →
              </button>
            </div>
            
            <div className="p-6 border border-border rounded-lg bg-card">
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">Platform Control</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Access all platform management tools
              </p>
              <button 
                onClick={() => navigate('/admin/security')}
                className="text-sm text-primary hover:text-primary/80 hover:underline"
              >
                View Security →
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SuperAdminDashboard;
