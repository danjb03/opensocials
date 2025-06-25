
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBrandSettings } from '@/hooks/brand/useBrandSettings';
import ProfileForm from '@/components/brand/setup/ProfileForm';
import BrandLayout from '@/components/layouts/BrandLayout';

const industries = [
  'Technology', 
  'Fashion', 
  'Food & Beverage', 
  'Beauty & Cosmetics', 
  'Health & Wellness',
  'Travel & Hospitality', 
  'Entertainment', 
  'Sports', 
  'Education', 
  'Finance',
  'Other'
];

const budgetRanges = [
  'Under £1,000',
  '£1,000 - £5,000',
  '£5,000 - £10,000',
  '£10,000 - £25,000',
  '£25,000 - £50,000',
  '£50,000 - £100,000',
  'Over £100,000'
];

const BrandSettings = () => {
  const { profile, isLoading, updateProfile } = useBrandSettings();

  if (isLoading) {
    return (
      <BrandLayout>
        <div className="container mx-auto p-6">
          <div className="animate-pulse">
            <h1 className="text-3xl font-bold mb-6 bg-gray-200 h-8 w-48 rounded"></h1>
            <div className="bg-gray-200 h-64 rounded"></div>
          </div>
        </div>
      </BrandLayout>
    );
  }

  return (
    <BrandLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Brand Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Brand Profile</CardTitle>
            <CardDescription>Update your brand information</CardDescription>
          </CardHeader>
          <CardContent>
            {profile && (
              <div className="text-sm text-muted-foreground mb-4">
                Company: {profile.company_name || 'Not set'}
              </div>
            )}
            <div className="text-center py-8 text-muted-foreground">
              Brand settings configuration coming soon...
            </div>
          </CardContent>
        </Card>
      </div>
    </BrandLayout>
  );
};

export default BrandSettings;
