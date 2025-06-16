
import { Home, Users, Settings, Shield, FileText, BarChart2, DollarSign, Bot, Network } from 'lucide-react';

export const getAdminMenuItems = (isActiveRoute: (path: string, exact?: boolean) => boolean, pendingCount: number) => [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
    isActive: isActiveRoute('/admin', true)
  },
  {
    title: "User Management",
    url: "/admin/users",
    icon: Users,
    isActive: isActiveRoute('/admin/users')
  },
  {
    title: "CRM",
    url: "/admin/crm",
    icon: BarChart2,
    isActive: isActiveRoute('/admin/crm')
  },
  {
    title: "Projects",
    url: "/admin/projects", 
    icon: FileText,
    isActive: isActiveRoute('/admin/projects')
  },
  {
    title: "Campaign Review",
    url: "/admin/campaign-review",
    icon: Bot,
    isActive: isActiveRoute('/admin/campaign-review'),
    notificationCount: pendingCount
  },
  {
    title: "Pricing Floors",
    url: "/admin/pricing-floors",
    icon: DollarSign,
    isActive: isActiveRoute('/admin/pricing-floors')
  },
  {
    title: "Platform Map",
    url: "/admin/platform-map",
    icon: Network,
    isActive: isActiveRoute('/admin/platform-map')
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
