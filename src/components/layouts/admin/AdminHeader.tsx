
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";

interface AdminHeaderProps {
  role: string;
}

const AdminHeader = memo(({ role }: AdminHeaderProps) => {
  const { role: userRole } = useUnifiedAuth();
  const isSuperAdmin = userRole === 'super_admin';

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border bg-background px-4">
      <SidebarTrigger className="text-foreground hover:bg-accent hover:text-accent-foreground transition-colors" />
      
      {isSuperAdmin && (
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link to="/super-admin">
            <ArrowLeft className="h-4 w-4" />
            Back to Super Admin
          </Link>
        </Button>
      )}
    </header>
  );
});

AdminHeader.displayName = 'AdminHeader';

export default AdminHeader;
