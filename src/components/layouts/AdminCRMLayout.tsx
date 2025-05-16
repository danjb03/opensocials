
import { ReactNode } from 'react';

interface AdminCRMLayoutProps {
  children: ReactNode;
}

const AdminCRMLayout = ({ children }: AdminCRMLayoutProps) => {
  return (
    <div className="container mx-auto py-8">
      {children}
    </div>
  );
};

export default AdminCRMLayout;
