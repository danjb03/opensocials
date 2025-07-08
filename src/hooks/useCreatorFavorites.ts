import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

interface Favorite {
  id: string;
  creator_id: string;
  brand_id: string;
  created_at: string;
}

interface UseCreatorFavoritesReturn {
  favorites: Favorite[];
  isLoading: boolean;
  error: string | null;
  addFavorite: (brandId: string) => Promise<void>;
  removeFavorite: (brandId: string) => Promise<void>;
}

export const useCreatorFavorites = (): UseCreatorFavoritesReturn => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUnifiedAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      setError(null);

      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('creator_favorites')
          .select('*')
          .eq('creator_id', user.id);

        if (error) {
          setError(error.message);
        } else {
          setFavorites(data || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user?.id]);

  const addFavorite = async (brandId: string) => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'User ID not found. Please sign in.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('creator_favorites')
        .insert([{ creator_id: user.id, brand_id: brandId }]);

      if (error) {
        toast({
          title: 'Error',
          description: `Failed to add to favorites: ${error.message}`,
          variant: 'destructive',
        });
      } else {
        setFavorites([...favorites, {
          id: data[0].id,
          creator_id: user.id,
          brand_id: brandId,
          created_at: data[0].created_at,
        }]);
        toast({
          title: 'Success',
          description: 'Added to favorites!',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: `Failed to add to favorites: ${err.message}`,
        variant: 'destructive',
      });
    }
  };

  const removeFavorite = async (brandId: string) => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'User ID not found. Please sign in.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const favoriteToRemove = favorites.find(fav => fav.brand_id === brandId);

      if (!favoriteToRemove) {
        toast({
          title: 'Info',
          description: 'This brand is not in your favorites.',
        });
        return;
      }

      const { error } = await supabase
        .from('creator_favorites')
        .delete()
        .eq('id', favoriteToRemove.id);

      if (error) {
        toast({
          title: 'Error',
          description: `Failed to remove from favorites: ${error.message}`,
          variant: 'destructive',
        });
      } else {
        setFavorites(favorites.filter(fav => fav.id !== favoriteToRemove.id));
        toast({
          title: 'Success',
          description: 'Removed from favorites!',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: `Failed to remove from favorites: ${err.message}`,
        variant: 'destructive',
      });
    }
  };

  return {
    favorites,
    isLoading,
    error,
    addFavorite,
    removeFavorite,
  };
};
