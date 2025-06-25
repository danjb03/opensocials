
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

const CreatorSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [platform, setPlatform] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !platform.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to complete setup');
      navigate('/auth');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🚀 Starting creator profile setup');
      
      // Create basic creator profile
      const profileData = {
        user_id: user.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        primary_platform: platform.trim(),
        bio: null,
        avatar_url: null,
        banner_url: null,
        username: null,
        content_types: [],
        platforms: [platform.trim()],
        industries: [],
        social_handles: {},
        audience_location: {},
        visibility_settings: {
          showInstagram: true,
          showTiktok: true,
          showYoutube: true,
          showLinkedin: true,
          showLocation: true,
          showAnalytics: true
        },
        is_profile_complete: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('💾 Creating creator profile:', profileData);

      const { error } = await supabase
        .from('creator_profiles')
        .upsert(profileData, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }

      console.log('✅ Creator profile created successfully');
      toast.success('Profile setup complete!');
      
      // Force page refresh to ensure auth context is updated
      setTimeout(() => {
        window.location.href = '/creator/dashboard';
      }, 500);

    } catch (error: any) {
      console.error('❌ Error setting up creator profile:', error);
      toast.error('Failed to set up profile: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-foreground">
            Complete Your Creator Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="platform">Main Platform</Label>
              <Input 
                id="platform" 
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                placeholder="Instagram, TikTok, etc."
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Setting up...' : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorSetup;
