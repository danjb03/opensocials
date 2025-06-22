
import { memo } from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";

interface AdminHeaderProps {
  role?: string;
}

const AdminHeader = memo(({ role }: AdminHeaderProps) => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold text-foreground">Admin Dashboard</h1>
      </div>
    </header>
  );
});

AdminHeader.displayName = 'AdminHeader';

export default AdminHeader;
