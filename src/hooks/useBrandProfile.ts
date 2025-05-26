
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from '@/components/ui/sonner';

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
  created_at: string;
  updated_at: string;
}

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
        // Get the brand profile for the current user
        const { data, error } = await supabase
          .from('brand_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setProfile(data);
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
      const { error } = await supabase
        .from('brand_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;
      
      setProfile(prev => prev ? {
        ...prev,
        ...updates,
        updated_at: new Date().toISOString()
      } : null);
      
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
      const newProfile = {
        user_id: user.id,
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('brand_profiles')
        .insert(newProfile);

      if (error) throw error;
      
      setProfile(newProfile);
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
