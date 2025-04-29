
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import BrandLayout from '@/components/layouts/BrandLayout';
import { mockCreatorsBase } from '@/data/mockCreators';
import { Creator } from '@/types/creator';

// Import our new components
import { CreatorFilters } from '@/components/brand/creator-search/CreatorFilters';
import { CreatorList } from '@/components/brand/creator-search/CreatorList';
import { CreatorGrid } from '@/components/brand/creator-search/CreatorGrid';
import { SelectedCreatorsBar } from '@/components/brand/creator-search/SelectedCreatorsBar';
import { ViewToggle } from '@/components/brand/creator-search/ViewToggle';
import { CreatorProfileModal } from '@/components/brand/creator-search/CreatorProfileModal';

const CreatorSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedCreators, setSelectedCreators] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState(searchParams.get('platform') || 'all');
  const [filterAudience, setFilterAudience] = useState(searchParams.get('audience') || 'all');
  const [filterContentType, setFilterContentType] = useState(searchParams.get('contentType') || 'all');
  const [filterLocation, setFilterLocation] = useState(searchParams.get('location') || 'all');
  const [filterSkills, setFilterSkills] = useState<string[]>([]);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  
  // New state for the profile modal
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoadingCreator, setIsLoadingCreator] = useState(false);
  
  const { toast } = useToast();

  // Apply any filtering directly to the mock creators
  const filteredCreators: Creator[] = mockCreatorsBase.filter(creator => {
    // Text search filter
    const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Platform filter
    const matchesPlatform = filterPlatform === 'all' || creator.platform === filterPlatform;
    
    // Audience filter
    const matchesAudience = filterAudience === 'all' || creator.audience === filterAudience;
    
    // Content type filter
    const matchesContentType = filterContentType === 'all' || creator.contentType === filterContentType;
    
    // Location filter - new
    const matchesLocation = filterLocation === 'all' || 
      (creator.audienceLocation && 
        (creator.audienceLocation.primary.toLowerCase().includes(filterLocation.toLowerCase()) ||
         (creator.audienceLocation.secondary && 
          creator.audienceLocation.secondary.some(loc => 
            loc.toLowerCase().includes(filterLocation.toLowerCase())
          ))
        )
      );
    
    // Skills filter
    const matchesSkills = filterSkills.length === 0 || creator.skills.some(skill => 
      filterSkills.includes(skill)
    );
    
    return matchesSearch && matchesPlatform && matchesAudience && matchesContentType && matchesLocation && matchesSkills;
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filterPlatform && filterPlatform !== 'all') params.set('platform', filterPlatform);
    if (filterAudience && filterAudience !== 'all') params.set('audience', filterAudience);
    if (filterContentType && filterContentType !== 'all') params.set('contentType', filterContentType);
    if (filterLocation && filterLocation !== 'all') params.set('location', filterLocation);
    if (filterSkills.length > 0) params.set('skills', filterSkills.join(','));
    setSearchParams(params);
  }, [filterPlatform, filterAudience, filterContentType, filterLocation, filterSkills, setSearchParams]);

  const handleToggleCreator = (creatorId: number) => {
    setSelectedCreators(prev => 
      prev.includes(creatorId)
        ? prev.filter(id => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  const handleViewCreatorProfile = (creatorId: number) => {
    setIsLoadingCreator(true);
    setIsProfileModalOpen(true);
    
    // Simulate loading of additional creator details
    setTimeout(() => {
      const creator = mockCreatorsBase.find(c => c.id === creatorId);
      if (creator) {
        // In a real app, we would fetch additional details here
        // For now, we'll just simulate some data
        const enhancedCreator = {
          ...creator,
          about: `Hi, I'm ${creator.name}! I'm a content creator specializing in ${creator.contentType} content for ${creator.audience} audiences. I love creating engaging content that resonates with my followers.`,
          socialLinks: {
            instagram: 'https://instagram.com',
            tiktok: creator.platform === 'TikTok' ? 'https://tiktok.com' : undefined,
            youtube: creator.platform === 'YouTube' ? 'https://youtube.com' : undefined,
            twitter: 'https://twitter.com',
          },
          metrics: {
            followerCount: creator.followers,
            engagementRate: creator.engagement,
            avgViews: `${Math.floor(parseInt(creator.followers.replace(/[^0-9]/g, '')) * 0.3).toLocaleString()} views`,
            avgLikes: `${Math.floor(parseInt(creator.followers.replace(/[^0-9]/g, '')) * 0.08).toLocaleString()} likes`,
          },
          audienceLocation: {
            primary: creator.id % 3 === 0 ? 'United States' : creator.id % 3 === 1 ? 'United Kingdom' : 'Global',
            secondary: creator.id % 2 === 0 ? ['Canada', 'Australia', 'Germany'] : ['Mexico', 'Brazil', 'India'],
            countries: [
              { name: 'United States', percentage: creator.id % 3 === 0 ? 65 : 30 },
              { name: 'United Kingdom', percentage: creator.id % 3 === 1 ? 58 : 15 },
              { name: 'Canada', percentage: 10 },
              { name: 'Australia', percentage: 8 },
              { name: 'Others', percentage: creator.id % 3 === 2 ? 40 : 7 }
            ]
          }
        };
        setSelectedCreator(enhancedCreator);
      }
      setIsLoadingCreator(false);
    }, 1000);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
    setTimeout(() => {
      setSelectedCreator(null);
    }, 300); // Wait for the dialog close animation
  };

  const addAllToCart = () => {
    if (selectedCreators.length === 0) {
      toast({
        title: "No creators selected",
        description: "Please select at least one creator to add to your cart.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Creators added to cart",
      description: `${selectedCreators.length} creators added to your project.`
    });

    console.log("Selected creators:", selectedCreators);
    setSelectedCreators([]);
  };

  const resetFilters = () => {
    setFilterPlatform('all');
    setFilterAudience('all');
    setFilterContentType('all');
    setFilterLocation('all');
    setFilterSkills([]);
    setSearchTerm('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filterPlatform !== 'all') count++;
    if (filterAudience !== 'all') count++;
    if (filterContentType !== 'all') count++;
    if (filterLocation !== 'all') count++;
    if (filterSkills.length > 0) count++;
    return count;
  };

  return (
    <BrandLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Find Creators</h1>
            <p className="text-gray-600">Discover creators that match your brand's needs</p>
          </div>
          
          <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <CreatorFilters 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterPlatform={filterPlatform}
              onPlatformChange={setFilterPlatform}
              filterAudience={filterAudience}
              onAudienceChange={setFilterAudience}
              filterContentType={filterContentType}
              onContentTypeChange={setFilterContentType}
              filterLocation={filterLocation}
              onLocationChange={setFilterLocation}
              filterSkills={filterSkills}
              onSkillsChange={setFilterSkills}
              isFilterSheetOpen={isFilterSheetOpen}
              setIsFilterSheetOpen={setIsFilterSheetOpen}
              resetFilters={resetFilters}
              getActiveFilterCount={getActiveFilterCount}
            />
          </CardContent>
        </Card>
        
        <SelectedCreatorsBar 
          selectedCreators={selectedCreators}
          onAddToCart={addAllToCart}
        />
        
        {viewMode === 'grid' ? (
          <CreatorGrid 
            creators={filteredCreators}
            selectedCreators={selectedCreators}
            onToggleCreator={handleToggleCreator}
            onViewProfile={handleViewCreatorProfile}
          />
        ) : (
          <CreatorList
            creators={filteredCreators}
            selectedCreators={selectedCreators}
            onToggleCreator={handleToggleCreator}
            onViewProfile={handleViewCreatorProfile}
          />
        )}
        
        <CreatorProfileModal 
          creator={selectedCreator} 
          isOpen={isProfileModalOpen} 
          onClose={handleCloseProfileModal}
          isLoading={isLoadingCreator}
        />
      </div>
    </BrandLayout>
  );
};

export default CreatorSearch;
