
import { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminCRMLayoutProps {
  children: ReactNode;
}

const AdminCRMLayout = ({ children }: AdminCRMLayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`container mx-auto ${isMobile ? 'px-4 py-4' : 'py-8'}`}>
      {children}
    </div>
  );
};

export default AdminCRMLayout;
