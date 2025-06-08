
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TikTokIcon, Instagram, Youtube } from '@/components/icons/SocialIcons';
import { useNavigate } from 'react-router-dom';

interface EmptyProfileStateProps {
  onStartProfileSetup?: () => void;
}

const EmptyProfileState: React.FC<EmptyProfileStateProps> = ({
  onStartProfileSetup
}) => {
  const navigate = useNavigate();

  const handleStartSetup = () => {
    if (onStartProfileSetup) {
      onStartProfileSetup();
    } else {
      // Navigate to the create profile page
      navigate('/creator/create-profile');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-4xl">
        <Card className="shadow-lg border-dashed border-2 bg-card">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold">Complete Your Creator Profile</CardTitle>
            <CardDescription className="text-lg mt-2">
              Your profile is currently empty. Add details to be discovered by brands.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="flex gap-6 mb-6">
                <TikTokIcon size={48} className="text-muted-foreground" />
                <Instagram size={48} className="text-muted-foreground" />
                <Youtube size={48} className="text-muted-foreground" />
              </div>
              <p className="text-center text-muted-foreground max-w-2xl text-lg leading-relaxed">
                Complete your profile so brands can find, trust, and book you instantly. 
                Match with campaigns built for creators like you.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-6 bg-background shadow-sm">
                <h3 className="font-semibold text-xl mb-3">1. Add Profile Info</h3>
                <p className="text-muted-foreground">
                  Upload your photo and bio. Make your first impression count.
                </p>
              </div>
              <div className="border rounded-lg p-6 bg-background shadow-sm">
                <h3 className="font-semibold text-xl mb-3">2. Connect Socials</h3>
                <p className="text-muted-foreground">
                  Connect your audience. Prove your reach. Own your value.
                </p>
              </div>
              <div className="border rounded-lg p-6 bg-background shadow-sm">
                <h3 className="font-semibold text-xl mb-3">3. Start Earning</h3>
                <p className="text-muted-foreground">
                  Be seen by premium brands and start landing paid campaigns.
                </p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center pt-8">
            <Button size="lg" className="px-8 py-3 text-lg" onClick={handleStartSetup}>
              Start Setting Up My Profile
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EmptyProfileState;
