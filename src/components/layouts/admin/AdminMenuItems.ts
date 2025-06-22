
import { LayoutDashboard, Users, Settings, Shield, FileText, BarChart2, DollarSign, Bot, Network, FolderOpen, UserCheck, MapPin } from 'lucide-react';

export const getAdminMenuItems = (isActiveRoute: (path: string, exact?: boolean) => boolean, pendingCount: number) => [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    isActive: isActiveRoute('/admin', true)
  },
  {
    title: "Campaign Review",
    url: "/admin/campaign-review",
    icon: FileText,
    isActive: isActiveRoute('/admin/campaign-review'),
    notificationCount: pendingCount > 0 ? pendingCount : undefined
  },
  {
    title: "User Management",
    url: "/admin/user-management",
    icon: Users,
    isActive: isActiveRoute('/admin/user-management')
  },
  {
    title: "Project Management",
    url: "/admin/project-management",
    icon: FolderOpen,
    isActive: isActiveRoute('/admin/project-management')
  },
  {
    title: "Order Management",
    url: "/admin/order-management",
    icon: UserCheck,
    isActive: isActiveRoute('/admin/order-management')
  },
  {
    title: "Platform Map",
    url: "/admin/platform-map",
    icon: MapPin,
    isActive: isActiveRoute('/admin/platform-map')
  },
  {
    title: "Pricing Floors",
    url: "/admin/pricing-floors",
    icon: DollarSign,
    isActive: isActiveRoute('/admin/pricing-floors')
  },
  {
    title: "Security",
    url: "/admin/security",
    icon: Shield,
    isActive: isActiveRoute('/admin/security')
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
    isActive: isActiveRoute('/admin/settings')
  }
];
