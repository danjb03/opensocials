
import React, { useState } from 'react';
import { useCreatorSearchNew } from '@/hooks/useCreatorSearchNew';
import BrandLayout from '@/components/layouts/BrandLayout';
import { CreatorSearchHeader } from '@/components/brand/creator-search/CreatorSearchHeader';
import { CreatorSearchFilters } from '@/components/brand/creator-search/CreatorSearchFilters';
import { CreatorSearchResults } from '@/components/brand/creator-search/CreatorSearchResults';
import { CreatorSearchModals } from '@/components/brand/creator-search/CreatorSearchModals';

interface CreatorSearchFilters {
  platforms: string[];
  industries: string[];
  followerRange: { min: number; max: number };
  engagementRange: { min: number; max: number };
  location: string;
  contentTypes: string[];
  verified: boolean;
}

const CreatorSearch = () => {
  // Search and filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<CreatorSearchFilters>({
    platforms: [],
    industries: [],
    followerRange: { min: 0, max: 10000000 },
    engagementRange: { min: 0, max: 20 },
    location: '',
    contentTypes: [],
    verified: false
  });
  
  // View and UI state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  
  // Modal state
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  // Data fetching
  const { data: creators = [], isLoading } = useCreatorSearchNew();

  const handleCreatorSelect = (creatorId: string) => {
    setSelectedCreators(prev => 
      prev.includes(creatorId) 
        ? prev.filter(id => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  const handleViewCreator = (creatorId: string) => {
    setSelectedCreatorId(creatorId);
  };

  const handleInviteCreators = () => {
    if (selectedCreators.length > 0) {
      setShowCampaignModal(true);
    }
  };

  return (
    <BrandLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center py-8 text-muted-foreground">
          Creator search components are not available in the current build.
          <br />
          Please check the component definitions for proper prop interfaces.
        </div>
      </div>
    </BrandLayout>
  );
};

export default CreatorSearch;
