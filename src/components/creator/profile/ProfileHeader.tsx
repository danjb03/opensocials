
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface ProfileHeaderProps {
  onEditProfile: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onEditProfile }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your creator profile and social media connections.
        </p>
      </div>
      <Button 
        onClick={onEditProfile}
        className="bg-white text-black hover:bg-gray-100"
      >
        <Edit className="w-4 h-4 mr-2" />
        Edit Profile
      </Button>
    </div>
  );
};

export default ProfileHeader;
