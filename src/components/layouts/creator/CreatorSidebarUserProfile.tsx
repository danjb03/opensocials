
import React, { useState } from 'react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
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
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-10 p-0 justify-center"
            >
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-xs font-medium text-muted-foreground">
                  {creatorProfile?.first_name?.charAt(0) || user?.email?.charAt(0) || 'C'}
                </span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent side="right" className="w-48 p-2">
            <div className="space-y-1">
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                {user?.email}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-border">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="w-full h-auto p-3 justify-start hover:bg-accent/50"
          >
            <div className="flex items-center space-x-3 w-full">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {creatorProfile?.first_name?.charAt(0) || user?.email?.charAt(0) || 'C'}
                </span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-foreground truncate">
                  {creatorProfile?.first_name ? `${creatorProfile.first_name} ${creatorProfile.last_name || ''}` : 'Creator Account'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" className="w-48 p-2">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigate('/creator/profile');
                setOpen(false);
              }}
              className="w-full justify-start"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CreatorSidebarUserProfile;
