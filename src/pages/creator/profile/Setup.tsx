import CreatorLayout from '@/components/layouts/CreatorLayout';
import { SocialMediaConnection } from '@/components/creator/SocialMediaConnection';

const ProfileSetup = () => {
  return (
    <CreatorLayout>
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Connect Your Social Accounts</h1>
        <p className="text-muted-foreground">
          Link your social media profiles to start sharing analytics with brands.
        </p>
        <SocialMediaConnection />
      </div>
    </CreatorLayout>
  );
};

export default ProfileSetup;
