
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

const CreatorSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedCreators, setSelectedCreators] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState(searchParams.get('platform') || 'all');
  const [filterAudience, setFilterAudience] = useState(searchParams.get('audience') || 'all');
  const [filterContentType, setFilterContentType] = useState(searchParams.get('contentType') || 'all');
  const [filterSkills, setFilterSkills] = useState<string[]>([]);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
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
    
    // Skills filter
    const matchesSkills = filterSkills.length === 0 || creator.skills.some(skill => 
      filterSkills.includes(skill)
    );
    
    return matchesSearch && matchesPlatform && matchesAudience && matchesContentType && matchesSkills;
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filterPlatform && filterPlatform !== 'all') params.set('platform', filterPlatform);
    if (filterAudience && filterAudience !== 'all') params.set('audience', filterAudience);
    if (filterContentType && filterContentType !== 'all') params.set('contentType', filterContentType);
    if (filterSkills.length > 0) params.set('skills', filterSkills.join(','));
    setSearchParams(params);
  }, [filterPlatform, filterAudience, filterContentType, filterSkills, setSearchParams]);

  const handleToggleCreator = (creatorId: number) => {
    setSelectedCreators(prev => 
      prev.includes(creatorId)
        ? prev.filter(id => id !== creatorId)
        : [...prev, creatorId]
    );
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
    setFilterSkills([]);
    setSearchTerm('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filterPlatform !== 'all') count++;
    if (filterAudience !== 'all') count++;
    if (filterContentType !== 'all') count++;
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
          />
        ) : (
          <CreatorList
            creators={filteredCreators}
            selectedCreators={selectedCreators}
            onToggleCreator={handleToggleCreator}
          />
        )}
      </div>
    </BrandLayout>
  );
};

export default CreatorSearch;
