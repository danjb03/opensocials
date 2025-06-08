
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, Briefcase, FileText, UserPlus, BarChart, Handshake } from 'lucide-react';

const AdminDashboard = () => {
  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage users and their roles',
      icon: Users,
      href: '/admin/users',
    },
    {
      title: 'Invite Users',
      description: 'Send invitations to new users',
      icon: UserPlus,
      href: '/admin/invite',
    },
    {
      title: 'Project Management',
      description: 'Oversee all active projects',
      icon: FileText,
      href: '/admin/projects',
    },
    {
      title: 'Brand CRM',
      description: 'Manage brand relationships',
      icon: Briefcase,
      href: '/admin/crm/brands',
    },
    {
      title: 'Creator CRM',
      description: 'Track creator performance',
      icon: Users,
      href: '/admin/crm/creators',
    },
    {
      title: 'Deal Pipeline',
      description: 'Monitor deal progress',
      icon: Handshake,
      href: '/admin/crm/deals',
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your platform and monitor key metrics.</p>
      </div>

      <div className="grid gap-6 mb-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.3%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Card key={action.href} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <action.icon className="h-5 w-5" />
                  {action.title}
                </CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild className="w-full">
                  <Link to={action.href}>Go to {action.title}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
