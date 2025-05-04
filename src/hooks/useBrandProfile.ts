
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from '@/components/ui/sonner';

interface BrandProfile {
  id: string;
  user_id: string;
  company_name: string;
  logo_url: string | null;
  website: string | null;
  industry: string | null;
  is_complete: boolean;
  created_at: string;
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
        // Get the brand profile directly using user id
        const { data, error } = await supabase
          .from('brand_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        
        setProfile(data);
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
    if (!profile || !user) {
      toast.error('You must be logged in to update your profile');
      return { success: false };
    }

    try {
      const { error } = await supabase
        .from('brand_profiles')
        .update(updates)
        .eq('id', profile.id);

      if (error) throw error;
      
      setProfile({
        ...profile,
        ...updates
      });
      
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
      return { success: false, error: err.message };
    }
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile
  };
};
