
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from '@/components/ui/sonner';

interface BrandProfile {
  id: string;
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
        // Get the profile for the current brand user
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .eq('role', 'brand')
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          // Transform profile data to match expected BrandProfile interface
          setProfile({
            id: data.id,
            company_name: data.company_name || '',
            logo_url: data.logo_url,
            website: data.website,
            industry: data.industry,
            is_complete: data.is_complete || false,
            created_at: data.created_at || new Date().toISOString(),
          });
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
    if (!profile || !user) {
      toast.error('You must be logged in to update your profile');
      return { success: false };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

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
