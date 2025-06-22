
import { memo } from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";

interface SuperAdminHeaderProps {
  role: string;
}

const SuperAdminHeader = memo(({ role }: SuperAdminHeaderProps) => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border bg-background px-4">
      <SidebarTrigger className="text-foreground hover:bg-accent hover:text-accent-foreground transition-colors" />
      
      <div className="text-sm text-muted-foreground">
        Super Admin Dashboard
      </div>
    </header>
  );
});

SuperAdminHeader.displayName = 'SuperAdminHeader';

export default SuperAdminHeader;
