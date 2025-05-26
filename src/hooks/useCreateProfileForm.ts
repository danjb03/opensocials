
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

interface FormData {
  fullName: string;
  bio: string;
  location: string;
  industry: string;
  contentTypes: string[];
  instagramHandle: string;
  tiktokHandle: string;
  youtubeHandle: string;
  followers: string;
  avgViews: string;
  engagementRate: string;
}

export const useCreateProfileForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    bio: '',
    location: '',
    industry: '',
    contentTypes: [],
    instagramHandle: '',
    tiktokHandle: '',
    youtubeHandle: '',
    followers: '',
    avgViews: '',
    engagementRate: ''
  });

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

  return {
    formData,
    isLoading,
    handleInputChange,
    handleContentTypeToggle,
    handleSubmit
  };
};
