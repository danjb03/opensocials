
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { LinkIcon } from 'lucide-react';

declare global {
  interface Window {
    PhylloConnect: any;
  }
}

const industries = [
  'Fashion', 
  'Beauty & Cosmetics', 
  'Fitness & Health', 
  'Food & Beverage', 
  'Technology',
  'Travel', 
  'Lifestyle', 
  'Gaming', 
  'Music', 
  'Art & Design',
  'Other'
];

const contentTypes = [
  'Photo Posts',
  'Video Content',
  'Stories',
  'Reels/TikToks',
  'Live Streams',
  'Blog Posts',
  'Tutorials',
  'Reviews'
];

const CreateProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isPhylloLoading, setIsPhylloLoading] = useState(false);
  const [phylloScriptLoaded, setPhylloScriptLoaded] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    location: '',
    industry: '',
    contentTypes: [] as string[],
    instagramHandle: '',
    tiktokHandle: '',
    youtubeHandle: '',
    followers: '',
    avgViews: '',
    engagementRate: ''
  });

  const loadPhylloScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (phylloScriptLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.staging.getphyllo.com/connect/v2/phyllo-connect.js';
      script.async = true;
      script.onload = () => {
        setPhylloScriptLoaded(true);
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Phyllo Connect script'));
      };
      document.head.appendChild(script);
    });
  };

  const initializePhylloConnect = async () => {
    setIsPhylloLoading(true);
    
    try {
      await loadPhylloScript();
      
      const phylloConnect = window.PhylloConnect.initialize({
        clientDisplayName: "OS",
        environment: "staging",
        userId: "98ed42dd-4ede-4b3b-a00d-0054fc895a6a",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOThlZDQyZGQtNGVkZS00YjNiLWEwMGQtMDA1NGZjODk1YTZhIiwidGVuYW50X2lkIjoiYjJmMWEzN2ItYjliZi00YTEzLTlmYTctM2QwNTA1YjRhN2EyIiwidGVuYW50X2FwcF9pZCI6IjAyZTEzZTYyLTRjYjAtNDA2Zi1iYTUzLTE1MDBjNzQzMzQwZSIsInByb2R1Y3RzIjpbIkVOR0FHRU1FTlRfQVVESUVOQ0UiLCJJREVOVElUWSIsIkVOR0FHRU1FTlQiXSwiaXNzIjoiaHR0cHM6Ly9hcGkuZ2V0cGh5bGxvLmNvbSIsImF1ZCI6Imh0dHBzOi8vYXBpLmdldHBoeWxsby5jb20vdjEvaW50ZXJuYWwiLCJpYXQiOjE3NDgyOTQ2NjkuNzAxOTE3LCJleHAiOjE3NDg4OTk0NjkuNzAxOTA2fQ.82YCC8_JQkHwBKPHUitH6gugyc9W67FxetSlI70tWaw"
      });

      phylloConnect.on('accountConnected', async (accountId: string, workplatformId: string, userId: string) => {
        console.log('Account Connected:', accountId, workplatformId, userId);

        await fetch('https://pcnrnciwgdrukzciwexi.functions.supabase.co/storeConnectedAccount', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            platform: workplatformId,
            account_id: accountId,
            workplatform_id: workplatformId
          })
        });
        
        toast.success('Social account connected successfully!');
      });

      phylloConnect.on('error', (reason: string) => {
        console.log('Phyllo Connect error:', reason);
        toast.error('Failed to connect social account');
      });

      phylloConnect.on('exit', (reason: string) => {
        console.log('Phyllo Connect exit:', reason);
        setIsPhylloLoading(false);
      });

      phylloConnect.open();
    } catch (error) {
      console.error('Error initializing Phyllo Connect:', error);
      toast.error('Failed to load social account connection');
      setIsPhylloLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContentTypeToggle = (contentType: string) => {
    setFormData(prev => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(contentType)
        ? prev.contentTypes.filter(type => type !== contentType)
        : [...prev.contentTypes, contentType]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create a profile');
      return;
    }

    if (!formData.fullName || !formData.industry) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const profileData = {
        user_id: user.id,
        full_name: formData.fullName,
        bio: formData.bio || null,
        location: formData.location || null,
        industry: formData.industry,
        content_types: formData.contentTypes,
        instagram_handle: formData.instagramHandle || null,
        tiktok_handle: formData.tiktokHandle || null,
        youtube_handle: formData.youtubeHandle || null,
        followers_count: formData.followers ? parseInt(formData.followers) : null,
        avg_views: formData.avgViews ? parseInt(formData.avgViews) : null,
        engagement_rate: formData.engagementRate ? parseFloat(formData.engagementRate) : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('creator_profiles')
        .insert(profileData);

      if (error) throw error;

      toast.success('Profile created successfully!');
      navigate('/creator/dashboard');
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Create Your Creator Profile</h1>
          <p className="text-muted-foreground">Tell brands about yourself and your content</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Fill out your profile details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input 
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, Country"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Content Types</Label>
                <div className="grid grid-cols-2 gap-2">
                  {contentTypes.map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={formData.contentTypes.includes(type) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleContentTypeToggle(type)}
                      className="justify-start"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Connect Your Social Media</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect your social media accounts to showcase your reach and get ready for brand collaborations.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={initializePhylloConnect}
                      disabled={isPhylloLoading}
                      className="flex items-center gap-2"
                    >
                      <LinkIcon className="h-4 w-4" />
                      {isPhylloLoading ? 'Connecting...' : 'Connect Your Social Platforms'}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagramHandle">Instagram Handle</Label>
                  <Input 
                    id="instagramHandle"
                    value={formData.instagramHandle}
                    onChange={(e) => handleInputChange('instagramHandle', e.target.value)}
                    placeholder="@username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tiktokHandle">TikTok Handle</Label>
                  <Input 
                    id="tiktokHandle"
                    value={formData.tiktokHandle}
                    onChange={(e) => handleInputChange('tiktokHandle', e.target.value)}
                    placeholder="@username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="youtubeHandle">YouTube Handle</Label>
                  <Input 
                    id="youtubeHandle"
                    value={formData.youtubeHandle}
                    onChange={(e) => handleInputChange('youtubeHandle', e.target.value)}
                    placeholder="@channel"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="followers">Followers Count</Label>
                  <Input 
                    id="followers"
                    type="number"
                    value={formData.followers}
                    onChange={(e) => handleInputChange('followers', e.target.value)}
                    placeholder="10000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avgViews">Average Views</Label>
                  <Input 
                    id="avgViews"
                    type="number"
                    value={formData.avgViews}
                    onChange={(e) => handleInputChange('avgViews', e.target.value)}
                    placeholder="5000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="engagementRate">Engagement Rate (%)</Label>
                  <Input 
                    id="engagementRate"
                    type="number"
                    step="0.1"
                    value={formData.engagementRate}
                    onChange={(e) => handleInputChange('engagementRate', e.target.value)}
                    placeholder="3.5"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isLoading} className="min-w-32">
                  {isLoading ? 'Creating...' : 'Create Profile'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProfile;
