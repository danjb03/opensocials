
import { memo } from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";

interface AdminHeaderProps {
  role: string;
}

const AdminHeader = memo(({ role }: AdminHeaderProps) => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
      <SidebarTrigger className="text-foreground hover:bg-accent hover:text-accent-foreground transition-colors" />
    </header>
  );
});

AdminHeader.displayName = 'AdminHeader';

export default AdminHeader;
