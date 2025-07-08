
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';
import {
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface AdminHeaderProps {
  role: string;
}

const AdminHeader = memo(({ role }: AdminHeaderProps) => {
  const navigate = useNavigate();
  const { role: userRole } = useUnifiedAuth();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
      <SidebarTrigger className="text-foreground hover:bg-accent hover:text-accent-foreground transition-colors" />
      
      {userRole === 'super_admin' && (
        <div className="ml-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/super_admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Super Admin Dashboard
          </Button>
        </div>
      )}
    </header>
  );
});

AdminHeader.displayName = 'AdminHeader';

export default AdminHeader;
