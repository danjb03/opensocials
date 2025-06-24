
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { useBrandProfile } from '@/hooks/useBrandProfile';
import StripePaymentSetup from '@/components/brand/StripePaymentSetup';
import { toast } from 'sonner';

const BrandSettings = () => {
  const { user } = useUnifiedAuth();
  const { profile, updateProfile } = useBrandProfile();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Form state for company information
  const [companyData, setCompanyData] = useState({
    companyName: '',
    website: '',
    description: '',
    instagramUrl: '',
    tiktokUrl: '',
    youtubeUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
  });

  // Update form state when profile loads
  useEffect(() => {
    if (profile) {
      setCompanyData({
        companyName: profile.company_name || '',
        website: profile.website_url || '',
        description: profile.brand_bio || '',
        instagramUrl: profile.social_urls?.instagram || '',
        tiktokUrl: profile.social_urls?.tiktok || '',
        youtubeUrl: profile.social_urls?.youtube || '',
        linkedinUrl: profile.social_urls?.linkedin || '',
        twitterUrl: profile.social_urls?.twitter || '',
      });
    }
  }, [profile]);

  const handleCompanyDataChange = (field: string, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveCompanyInfo = async () => {
    setIsUpdating(true);
    try {
      const socialUrls = {
        instagram: companyData.instagramUrl || null,
        tiktok: companyData.tiktokUrl || null,
        youtube: companyData.youtubeUrl || null,
        linkedin: companyData.linkedinUrl || null,
        twitter: companyData.twitterUrl || null,
      };

      const result = await updateProfile({
        company_name: companyData.companyName,
        website_url: companyData.website || null,
        brand_bio: companyData.description || null,
        social_urls: socialUrls,
      });

      if (result.success) {
        toast.success('Company information updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update company information');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Update your company details and social media links</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input 
                  id="company-name" 
                  value={companyData.companyName}
                  onChange={(e) => handleCompanyDataChange('companyName', e.target.value)}
                  placeholder="Enter company name" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  value={companyData.website}
                  onChange={(e) => handleCompanyDataChange('website', e.target.value)}
                  placeholder="https://yourcompany.com" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Company Description</Label>
              <Input 
                id="description" 
                value={companyData.description}
                onChange={(e) => handleCompanyDataChange('description', e.target.value)}
                placeholder="Brief description of your company" 
              />
            </div>

            <Separator />
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Social Media Links</h4>
              <p className="text-sm text-muted-foreground">
                Add your social media profiles so creators can learn more about your brand
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram-url">Instagram URL</Label>
                  <Input 
                    id="instagram-url" 
                    value={companyData.instagramUrl}
                    onChange={(e) => handleCompanyDataChange('instagramUrl', e.target.value)}
                    placeholder="https://instagram.com/yourcompany" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiktok-url">TikTok URL</Label>
                  <Input 
                    id="tiktok-url" 
                    value={companyData.tiktokUrl}
                    onChange={(e) => handleCompanyDataChange('tiktokUrl', e.target.value)}
                    placeholder="https://tiktok.com/@yourcompany" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube-url">YouTube URL</Label>
                  <Input 
                    id="youtube-url" 
                    value={companyData.youtubeUrl}
                    onChange={(e) => handleCompanyDataChange('youtubeUrl', e.target.value)}
                    placeholder="https://youtube.com/@yourcompany" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin-url">LinkedIn URL</Label>
                  <Input 
                    id="linkedin-url" 
                    value={companyData.linkedinUrl}
                    onChange={(e) => handleCompanyDataChange('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/company/yourcompany" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter-url">Twitter URL</Label>
                  <Input 
                    id="twitter-url" 
                    value={companyData.twitterUrl}
                    onChange={(e) => handleCompanyDataChange('twitterUrl', e.target.value)}
                    placeholder="https://twitter.com/yourcompany" 
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSaveCompanyInfo}
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue={user?.email || ''} disabled />
              <p className="text-sm text-muted-foreground">Contact support to change your email address</p>
            </div>
            <Separator />
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Notifications</h4>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about your campaigns</p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive tips and product updates</p>
                </div>
                <Switch id="marketing-emails" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing & Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Billing & Usage</CardTitle>
            <CardDescription>Manage your subscription and billing details</CardDescription>
          </CardHeader>
          <CardContent>
            <StripePaymentSetup />
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-slate-50">Danger Zone</CardTitle>
            <CardDescription>Irreversible and destructive actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Delete Account</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrandSettings;
