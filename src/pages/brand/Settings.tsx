
import React from 'react';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon } from 'lucide-react';

const BrandSettings = () => {
  return (
    <BrandLayout>
      <div className="container mx-auto p-6 bg-background">
        <div className="mb-6">
          <h1 className="text-3xl font-light text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <SettingsIcon className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" placeholder="Your company name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" placeholder="Your industry" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </BrandLayout>
  );
};

export default BrandSettings;
