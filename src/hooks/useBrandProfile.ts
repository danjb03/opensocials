
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

interface SocialUrls {
  instagram?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
}

interface BrandProfile {
  user_id: string;
  company_name: string;
  logo_url: string | null;
  website_url: string | null;
  industry: string | null;
  budget_range: string | null;
  brand_bio: string | null;
  brand_goal: string | null;
  campaign_focus: string[] | null;
  social_urls: SocialUrls | null;
  created_at: string;
  updated_at: string;
}

const parseSocialUrls = (socialUrls: Json): SocialUrls => {
  if (!socialUrls || typeof socialUrls !== 'object') {
    return {
      instagram: null,
      tiktok: null,
      youtube: null,
      linkedin: null,
      twitter: null
    };
  }
  
  const urls = socialUrls as Record<string, any>;
  return {
    instagram: urls.instagram || null,
    tiktok: urls.tiktok || null,
    youtube: urls.youtube || null,
    linkedin: urls.linkedin || null,
    twitter: urls.twitter || null
  };
};

const socialUrlsToJson = (socialUrls: SocialUrls): Json => {
  return {
    instagram: socialUrls.instagram,
    tiktok: socialUrls.tiktok,
    youtube: socialUrls.youtube,
    linkedin: socialUrls.linkedin,
    twitter: socialUrls.twitter
  };
};

export const useBrandProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<BrandProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrandProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log('🔍 Fetching brand profile for user:', user.id);
        
        // Get the brand profile for the current user
        const { data, error } = await supabase
          .from('brand_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('❌ Error fetching brand profile:', error);
          throw error;
        }
        
        if (data) {
          console.log('✅ Brand profile found:', data);
          const profileData: BrandProfile = {
            ...data,
            social_urls: parseSocialUrls(data.social_urls)
          };
          setProfile(profileData);
        } else {
          console.log('⚠️ No brand profile found for user');
          setProfile(null);
        }
      } catch (err: any) {
        console.error('Error fetching brand profile:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrandProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<BrandProfile>) => {
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return { success: false };
    }

    try {
      console.log('🔄 Updating brand profile:', updates);
      
      // Convert social_urls to Json type for database
      const dbUpdates = {
        ...updates,
        social_urls: updates.social_urls ? socialUrlsToJson(updates.social_urls) : undefined,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('brand_profiles')
        .update(dbUpdates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating profile:', error);
        throw error;
      }
      
      console.log('✅ Profile updated successfully:', data);
      const profileData: BrandProfile = {
        ...data,
        social_urls: parseSocialUrls(data.social_urls)
      };
      setProfile(profileData);
      
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
      return { success: false, error: err.message };
    }
  };

  const createProfile = async (profileData: Omit<BrandProfile, 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast.error('You must be logged in to create a profile');
      return { success: false };
    }

    try {
      console.log('📝 Creating new brand profile:', profileData);
      
      const newProfile = {
        user_id: user.id,
        ...profileData,
        social_urls: profileData.social_urls ? socialUrlsToJson(profileData.social_urls) : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('brand_profiles')
        .insert(newProfile)
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating profile:', error);
        throw error;
      }
      
      console.log('✅ Profile created successfully:', data);
      const createdProfileData: BrandProfile = {
        ...data,
        social_urls: parseSocialUrls(data.social_urls)
      };
      setProfile(createdProfileData);
      toast.success('Profile created successfully');
      return { success: true };
    } catch (err: any) {
      console.error('Error creating profile:', err);
      toast.error('Failed to create profile');
      return { success: false, error: err.message };
    }
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    createProfile
  };
};
