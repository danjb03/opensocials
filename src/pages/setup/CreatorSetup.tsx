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

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <UnifiedProfileForm isNewUser={true} />
    </div>
  );
};

export default CreatorSetup;
