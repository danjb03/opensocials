
import React, { useState } from 'react';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreatorSidebarUserProfileProps {
  isSidebarOpen: boolean;
}

const CreatorSidebarUserProfile = ({ isSidebarOpen }: CreatorSidebarUserProfileProps) => {
  const { user, creatorProfile } = useUnifiedAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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
    setOpen(false);
  };

  if (!isSidebarOpen) {
    return (
      <div className="p-4 border-t border-border">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <User className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" side="right">
            <div className="space-y-2">
              <div className="px-2 py-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {creatorProfile?.first_name || user?.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
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
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className="border-t border-border p-4">
      <div className="space-y-3">
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {creatorProfile?.first_name || user?.email}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Action Button */}
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
  );
};

export default CreatorSidebarUserProfile;
