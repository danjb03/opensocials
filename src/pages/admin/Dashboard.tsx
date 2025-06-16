
import RevenueAnalytics from '@/components/admin/dashboard/RevenueAnalytics';

const AdminDashboard = () => {
  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor platform performance and revenue metrics.</p>
      </div>

      <RevenueAnalytics />
    </div>
  );
};

export default AdminDashboard;
