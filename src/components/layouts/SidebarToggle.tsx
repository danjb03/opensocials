
import { ChevronLeft, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarToggleProps {
  isCollapsed: boolean;
  onClick: () => void;
}

const SidebarToggle = ({ isCollapsed, onClick }: SidebarToggleProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute right-[-12px] top-4 h-6 w-6 rounded-full border bg-background"
      onClick={onClick}
    >
      {isCollapsed ? (
        <Menu className="h-4 w-4" />
      ) : (
        <ChevronLeft className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};

export default SidebarToggle;
