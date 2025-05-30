import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TikTokIcon, Instagram, Youtube } from '@/components/icons/SocialIcons';
interface EmptyProfileStateProps {
  onStartProfileSetup: () => void;
}
const EmptyProfileState: React.FC<EmptyProfileStateProps> = ({
  onStartProfileSetup
}) => {
  return <Card className="shadow-md border-dashed border-2 bg-gray-50">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Complete Your Creator Profile</CardTitle>
        <CardDescription className="text-base">
          Your profile is currently empty. Add details to be discovered by brands.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="flex gap-4">
            <TikTokIcon size={32} className="text-gray-400" />
            <Instagram size={32} className="text-gray-400" />
            <Youtube size={32} className="text-gray-400" />
          </div>
          <p className="mt-4 text-center text-muted-foreground max-w-md my-[17px]">Complete your profile so brands can find, trust, and book you instantly. Match with campaigns built for creators like you.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="font-medium text-lg">1. Add Profile Info</h3>
            <p className="text-sm text-muted-foreground">Add Your Info - Upload your photo and bio. Make your first impression count.</p>
          </div>
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="font-medium text-lg">2. Connect Socials</h3>
            <p className="text-sm text-muted-foreground">Connect your audience. Prove your reach. Own your value.</p>
          </div>
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="font-medium text-lg">3. Get Discovered</h3>
            <p className="text-sm text-muted-foreground">Start receiving brand opportunities</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button size="lg" onClick={onStartProfileSetup}>
          Start Setting Up My Profile
        </Button>
      </CardFooter>
    </Card>;
};
export default EmptyProfileState;