
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

const CreatorSetup = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate('/creator/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-foreground">
            Complete Your Creator Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="Enter your first name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Enter your last name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="platform">Main Platform</Label>
            <Input id="platform" placeholder="Instagram, TikTok, etc." />
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            Complete Setup
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorSetup;
