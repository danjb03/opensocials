
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Camera, Users, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyProfileStateProps {
  onStartProfileSetup: () => void;
}

const EmptyProfileState: React.FC<EmptyProfileStateProps> = ({ onStartProfileSetup }) => {
  const navigate = useNavigate();

  const handleStartSetup = () => {
    navigate('/creator/profile/setup');
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-12 text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Complete Your Creator Profile</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your profile is currently empty. Add details to be discovered by brands.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-muted flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="w-16 h-16 rounded-full border-2 border-muted flex items-center justify-center">
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="w-16 h-16 rounded-full border-2 border-muted flex items-center justify-center">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="mb-12">
            <p className="text-lg text-muted-foreground">
              Complete your profile so brands can find, trust, and book you instantly. Match with campaigns built for creators like you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">1. Add Profile Info</h3>
              <p className="text-muted-foreground">
                Upload your photo and bio. Make your first impression count.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">2. Connect Socials</h3>
              <p className="text-muted-foreground">
                Connect your audience. Prove your reach. Own your value.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">3. Start Earning</h3>
              <p className="text-muted-foreground">
                Be seen by premium brands and start landing paid campaigns.
              </p>
            </div>
          </div>

          <Button 
            size="lg" 
            onClick={handleStartSetup}
            className="px-8 py-3 text-lg"
          >
            Start Setting Up My Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyProfileState;
