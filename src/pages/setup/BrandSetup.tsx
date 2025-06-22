
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

const BrandSetup = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate('/brand/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-foreground">
            Complete Your Brand Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input id="company" placeholder="Enter your company name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" placeholder="Enter your industry" />
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            Complete Setup
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandSetup;
