
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useNavigate, useLocation } from 'react-router-dom';
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
  creatorType: string;
}

export const useCreateProfileForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
    engagementRate: '',
    creatorType: ''
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
      // Call the edge function for unified profile creation
      const { data, error } = await supabase.functions.invoke('create-creator-profile', {
        body: {
          fullName: formData.fullName,
          bio: formData.bio,
          location: formData.location,
          industry: formData.industry,
          contentTypes: formData.contentTypes,
          instagramHandle: formData.instagramHandle,
          tiktokHandle: formData.tiktokHandle,
          youtubeHandle: formData.youtubeHandle,
          followers: formData.followers,
          avgViews: formData.avgViews,
          engagementRate: formData.engagementRate,
          creatorType: formData.creatorType
        }
      });

      if (error) {
        console.error('Profile creation error:', error);
        throw error;
      }

      toast.success('Profile created successfully!');
      
      // Navigate based on current context
      if (location.pathname.startsWith('/super-admin')) {
        navigate('/super-admin/creators');
      } else {
        navigate('/creator/dashboard');
      }
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
