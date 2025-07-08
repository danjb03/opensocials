import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

interface BrandSidebarUserProfileProps {
  isSidebarOpen: boolean;
}

const BrandSidebarUserProfile = ({ isSidebarOpen }: BrandSidebarUserProfileProps) => {
  const navigate = useNavigate();
  const { user, brandProfile } = useUnifiedAuth();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Failed to sign out.');
      } else {
        toast.success('Signed out successfully.');
        navigate('/auth');
      }
    } catch (err) {
      console.error('Unexpected error signing out:', err);
      toast.error('Unexpected error signing out.');
    }
  };

  const handleSettings = () => {
    navigate('/brand/settings');
  };

  if (!user) return null;

  return (
    <div className="border-t border-border p-4">
      {isSidebarOpen ? (
        <div className="space-y-3">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {brandProfile?.company_name || user.email}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSettings}
              className="w-full justify-start text-sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="w-full justify-start text-sm hover:bg-red-500/10 hover:text-red-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="w-8 h-8 hover:bg-red-500/10 hover:text-red-500"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default BrandSidebarUserProfile;
