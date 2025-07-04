
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import BrandSidebarHeader from './BrandSidebarHeader';
import BrandSidebarQuickActions from './BrandSidebarQuickActions';
import BrandSidebarNavigation from './BrandSidebarNavigation';
import BrandSidebarUserProfile from './BrandSidebarUserProfile';

const BrandSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('brand-sidebar-open');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const navigate = useNavigate();
  const { role } = useUnifiedAuth();

  useEffect(() => {
    localStorage.setItem('brand-sidebar-open', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-black border-r border-gray-800 flex flex-col min-h-screen`}>
      <BrandSidebarHeader 
        isSidebarOpen={isSidebarOpen} 
        onToggle={toggleSidebar} 
      />

      {/* Super Admin Back Button */}
      {role === 'super_admin' && isSidebarOpen && (
        <div className="p-4 border-b border-gray-800">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/super_admin')}
            className="w-full flex items-center gap-2 bg-black border-gray-700 text-white hover:bg-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Super Admin
          </Button>
        </div>
      )}

      <BrandSidebarQuickActions isSidebarOpen={isSidebarOpen} />

      <div className="flex-1 py-4">
        <BrandSidebarNavigation isSidebarOpen={isSidebarOpen} />
      </div>

      <BrandSidebarUserProfile isSidebarOpen={isSidebarOpen} />
    </div>
  );
};

export default BrandSidebar;
