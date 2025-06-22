
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import CreatorSidebarHeader from './CreatorSidebarHeader';
import CreatorSidebarQuickActions from './CreatorSidebarQuickActions';
import CreatorSidebarNavigation from './CreatorSidebarNavigation';
import CreatorSidebarUserProfile from './CreatorSidebarUserProfile';

const CreatorSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('creator-sidebar-open');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const navigate = useNavigate();
  const { role } = useUnifiedAuth();

  useEffect(() => {
    localStorage.setItem('creator-sidebar-open', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-card border-r border-border flex flex-col`}>
      <CreatorSidebarHeader 
        isSidebarOpen={isSidebarOpen} 
        onToggle={toggleSidebar} 
      />

      {/* Super Admin Back Button */}
      {role === 'super_admin' && isSidebarOpen && (
        <div className="p-4 border-b border-border">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/super_admin')}
            className="w-full flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Super Admin
          </Button>
        </div>
      )}

      <CreatorSidebarQuickActions isSidebarOpen={isSidebarOpen} />

      <CreatorSidebarNavigation isSidebarOpen={isSidebarOpen} />

      <CreatorSidebarUserProfile isSidebarOpen={isSidebarOpen} />
    </div>
  );
};

export default CreatorSidebar;
