
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { SidebarTrigger } from "@/components/ui/sidebar";

interface AdminHeaderProps {
  role: string;
}

const AdminHeader = memo(({ role }: AdminHeaderProps) => {
  const navigate = useNavigate();

  const handleBackToSuperAdmin = () => {
    navigate('/super-admin');
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
      <SidebarTrigger className="text-foreground hover:bg-accent hover:text-accent-foreground transition-colors" />
      {role === 'super_admin' && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleBackToSuperAdmin}
          className="ml-auto flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Super Admin
        </Button>
      )}
    </header>
  );
});

AdminHeader.displayName = 'AdminHeader';

export default AdminHeader;
