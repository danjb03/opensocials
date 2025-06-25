
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { CreatorProfile } from '@/hooks/useCreatorProfile';

export interface ProfileEditFormProps {
  profile: CreatorProfile;
  isLoading: boolean;
  onSubmit: (updatedProfile: Partial<CreatorProfile>) => Promise<void>;
  onCancel: () => void;
}

const ProfileEditForm = ({ profile, isLoading, onSubmit, onCancel }: ProfileEditFormProps) => {
  const navigate = useNavigate();

  const handleComprehensiveSetup = () => {
    navigate('/creator/profile/complete-setup');
  };

  return (
    <div className="space-y-6">
      {/* Quick Setup Option */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white mb-1">Complete Profile Setup</h3>
              <p className="text-sm text-muted-foreground">
                Use our comprehensive 4-step setup to optimize your profile for brand discovery
              </p>
            </div>
            <Button onClick={handleComprehensiveSetup} variant="outline">
              Complete Setup
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ProfileEditForm;
