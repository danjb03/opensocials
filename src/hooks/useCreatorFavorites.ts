
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { toast } from 'sonner';

export const useCreatorFavorites = () => {
  const { user } = useUnifiedAuth();
  const queryClient = useQueryClient();

  // Fetch user's favorite creators
  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['creator-favorites', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // First get the favorite relationships
      const { data: favoriteRelations, error: favError } = await supabase
        .from('brand_creator_favorites')
        .select('creator_id')
        .eq('brand_id', user.id);

      if (favError) throw favError;
      if (!favoriteRelations || favoriteRelations.length === 0) return [];

      // Then get the creator profiles for those IDs
      const creatorIds = favoriteRelations.map(f => f.creator_id);
      const { data: creatorProfiles, error: profileError } = await supabase
        .from('creator_profiles')
        .select('*')
        .in('user_id', creatorIds);

      if (profileError) throw profileError;

      // Combine the data
      return favoriteRelations.map(fav => ({
        creator_id: fav.creator_id,
        creator_profiles: creatorProfiles?.find(p => p.user_id === fav.creator_id) || null
      })).filter(item => item.creator_profiles !== null);
    },
    enabled: !!user?.id
  });

  // Add creator to favorites
  const addToFavoritesMutation = useMutation({
    mutationFn: async (creatorId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('brand_creator_favorites')
        .insert({
          brand_id: user.id,
          creator_id: creatorId
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-favorites'] });
      toast.success('Creator added to favorites!');
    },
    onError: (error) => {
      console.error('Error adding to favorites:', error);
      toast.error('Failed to add creator to favorites');
    }
  });

  // Remove creator from favorites
  const removeFromFavoritesMutation = useMutation({
    mutationFn: async (creatorId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('brand_creator_favorites')
        .delete()
        .eq('brand_id', user.id)
        .eq('creator_id', creatorId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-favorites'] });
      toast.success('Creator removed from favorites');
    },
    onError: (error) => {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove creator from favorites');
    }
  });

  const toggleFavorite = (creatorId: string) => {
    const isFavorite = favorites.some(fav => fav.creator_id === creatorId);
    
    if (isFavorite) {
      removeFromFavoritesMutation.mutate(creatorId);
    } else {
      addToFavoritesMutation.mutate(creatorId);
    }
  };

  const isFavorite = (creatorId: string) => {
    return favorites.some(fav => fav.creator_id === creatorId);
  };

  return {
    favorites,
    isLoading,
    toggleFavorite,
    isFavorite,
    isToggling: addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending
  };
};
