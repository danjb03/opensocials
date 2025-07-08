
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

interface Favorite {
  id: string;
  creator_id: string;
  brand_id: string;
  created_at: string;
  creator_profiles?: {
    first_name: string;
    last_name: string;
    username: string;
    avatar_url: string;
  };
}

interface UseCreatorFavoritesReturn {
  favorites: Favorite[];
  isLoading: boolean;
  error: string | null;
  addFavorite: (creatorId: string) => Promise<void>;
  removeFavorite: (creatorId: string) => Promise<void>;
  isFavorite: (creatorId: string) => boolean;
}

export const useCreatorFavorites = (): UseCreatorFavoritesReturn => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUnifiedAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('brand_creator_favorites')
          .select(`
            *,
            creator_profiles (
              first_name,
              last_name,
              username,
              avatar_url
            )
          `)
          .eq('brand_id', user.id);

        if (error) {
          setError(error.message);
        } else {
          setFavorites(data || []);
        }
      } catch (err) {
        setError('Failed to fetch favorites');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user?.id]);

  const addFavorite = async (creatorId: string) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('brand_creator_favorites')
        .insert({
          brand_id: user.id,
          creator_id: creatorId,
        })
        .select(`
          *,
          creator_profiles (
            first_name,
            last_name,
            username,
            avatar_url
          )
        `)
        .single();

      if (error) {
        console.error('Error adding favorite:', error);
        return;
      }

      if (data) {
        setFavorites(prev => [...prev, data]);
      }
    } catch (err) {
      console.error('Failed to add favorite:', err);
    }
  };

  const removeFavorite = async (creatorId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('brand_creator_favorites')
        .delete()
        .eq('brand_id', user.id)
        .eq('creator_id', creatorId);

      if (error) {
        console.error('Error removing favorite:', error);
        return;
      }

      setFavorites(prev => prev.filter(fav => fav.creator_id !== creatorId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  const isFavorite = (creatorId: string) => {
    return favorites.some(fav => fav.creator_id === creatorId);
  };

  return {
    favorites,
    isLoading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
};
