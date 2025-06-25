
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { UnifiedProfileForm } from '@/components/creator/UnifiedProfileForm';

const CreatorSetup = () => {
  const navigate = useNavigate();
  const { creatorProfile } = useUnifiedAuth();

  // Redirect if profile is already complete
  if (creatorProfile?.is_profile_complete) {
    navigate('/creator/dashboard');
    return null; // Render nothing while redirecting
  }

  const handleProfileSubmit = async (data: any) => {
    // Handle profile submission logic here
    console.log('Profile submitted:', data);
    // For now, just navigate to dashboard
    navigate('/creator/dashboard');
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <UnifiedProfileForm 
        isNewUser={true} 
        onSubmit={handleProfileSubmit}
      />
    </div>
  );
};

export default CreatorSetup;
