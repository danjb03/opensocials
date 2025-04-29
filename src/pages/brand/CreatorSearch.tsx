
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Grid2x2, List, PlusCircle, Filter } from 'lucide-react';
import { SkillsFilter, RelevanceFilter } from '@/components/brand/filters';

const mockCreators = [
  { id: 1, name: 'Alex Johnson', platform: 'instagram', audience: 'gen-z', contentType: 'photo', followers: '120K', engagement: '3.5%', priceRange: '$500-1000', matchScore: 87, skills: ['photography', 'lifestyle', 'fashion'], imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: 2, name: 'Sam Rivera', platform: 'youtube', audience: 'millennials', contentType: 'video', followers: '250K', engagement: '4.2%', priceRange: '$1000-2000', matchScore: 92, skills: ['video editing', 'tutorials', 'tech'], imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: 3, name: 'Jamie Chen', platform: 'tiktok', audience: 'gen-z', contentType: 'video', followers: '500K', engagement: '5.8%', priceRange: '$1500-3000', matchScore: 75, skills: ['dancing', 'challenges', 'trends'], imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: 4, name: 'Taylor Singh', platform: 'instagram', audience: 'millennials', contentType: 'photo', followers: '80K', engagement: '3.2%', priceRange: '$300-800', matchScore: 81, skills: ['travel', 'photography', 'food'], imageUrl: 'https://images.unsplash.com/photo-1500648741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: 5, name: 'Morgan Lee', platform: 'twitter', audience: 'gen-x', contentType: 'blog', followers: '45K', engagement: '2.8%', priceRange: '$250-600', matchScore: 65, skills: ['writing', 'opinion', 'news'], imageUrl: 'https://images.unsplash.com/photo-1534528741169-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: 6, name: 'Casey Wilson', platform: 'youtube', audience: 'boomers', contentType: 'review', followers: '110K', engagement: '3.9%', priceRange: '$600-1200', matchScore: 78, skills: ['product reviews', 'unboxing', 'tutorials'], imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
];

const CreatorSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedCreators, setSelectedCreators] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState(searchParams.get('platform') || 'all');
  const [filterAudience, setFilterAudience] = useState(searchParams.get('audience') || 'all');
  const [filterContentType, setFilterContentType] = useState(searchParams.get('contentType') || 'all');
  const [filterSkills, setFilterSkills] = useState<string[]>([]);
  const [minimumRelevance, setMinimumRelevance] = useState(60);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams();
    if (filterPlatform && filterPlatform !== 'all') params.set('platform', filterPlatform);
    if (filterAudience && filterAudience !== 'all') params.set('audience', filterAudience);
    if (filterContentType && filterContentType !== 'all') params.set('contentType', filterContentType);
    if (filterSkills.length > 0) params.set('skills', filterSkills.join(','));
    if (minimumRelevance !== 60) params.set('relevance', minimumRelevance.toString());
    setSearchParams(params);
  }, [filterPlatform, filterAudience, filterContentType, filterSkills, minimumRelevance, setSearchParams]);

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
    setMinimumRelevance(60);
    setSearchTerm('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filterPlatform !== 'all') count++;
    if (filterAudience !== 'all') count++;
    if (filterContentType !== 'all') count++;
    if (filterSkills.length > 0) count++;
    if (minimumRelevance !== 60) count++;
    return count;
  };

  const filteredCreators = mockCreators.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === 'all' || creator.platform === filterPlatform;
    const matchesAudience = filterAudience === 'all' || creator.audience === filterAudience;
    const matchesContentType = filterContentType === 'all' || creator.contentType === filterContentType;
    const matchesRelevance = creator.matchScore >= minimumRelevance;
    
    // Check if creator has any of the skills specified in the filter
    const matchesSkills = filterSkills.length === 0 || 
      filterSkills.some(skill => creator.skills.some(
        creatorSkill => creatorSkill.toLowerCase().includes(skill.toLowerCase())
      ));
    
    return matchesSearch && matchesPlatform && matchesAudience && matchesContentType && matchesSkills && matchesRelevance;
  });

  return (
    <BrandLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Find Creators</h1>
            <p className="text-gray-600">Discover creators that match your brand's needs</p>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              className="mr-2"
              onClick={() => setViewMode('grid')}
            >
              <Grid2x2 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <Input
                  placeholder="Search creators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={filterAudience} onValueChange={setFilterAudience}>
                  <SelectTrigger>
                    <SelectValue placeholder="Audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Audiences</SelectItem>
                    <SelectItem value="gen-z">Gen Z</SelectItem>
                    <SelectItem value="millennials">Millennials</SelectItem>
                    <SelectItem value="gen-x">Gen X</SelectItem>
                    <SelectItem value="boomers">Boomers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-1.5 w-full">
                      <Filter className="h-4 w-4" />
                      <span className="text-sm">Advanced Filters</span>
                      {getActiveFilterCount() > 0 && (
                        <span className="bg-secondary rounded-full px-2 py-0.5 text-xs ml-1">
                          {getActiveFilterCount()}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Advanced Filters</SheetTitle>
                      <SheetDescription>
                        Refine your creator search with advanced filters
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="mt-6 space-y-6">
                      <Select value={filterContentType} onValueChange={setFilterContentType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Content Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Content</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="photo">Photo</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="blog">Blog</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <SkillsFilter 
                        skills={filterSkills}
                        onSkillsChange={setFilterSkills}
                      />
                      
                      <RelevanceFilter
                        value={minimumRelevance}
                        onChange={setMinimumRelevance}
                      />
                      
                      <div className="flex gap-2 pt-4">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={resetFilters}
                        >
                          Reset
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={() => setIsFilterSheetOpen(false)}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {selectedCreators.length > 0 && (
          <div className="bg-white mb-6 p-4 rounded-lg border shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">{selectedCreators.length} creator{selectedCreators.length !== 1 ? 's' : ''} selected</span>
              </div>
              <Button onClick={addAllToCart}>
                Work with Creators
              </Button>
            </div>
          </div>
        )}
        
        {filteredCreators.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No creators found matching your criteria.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCreators.map(creator => (
              <Card key={creator.id} className="overflow-hidden">
                <div className="relative aspect-square">
                  <img 
                    src={creator.imageUrl} 
                    alt={creator.name} 
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
                    {creator.matchScore}% match
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg">{creator.name}</h3>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm text-gray-600">Platform: {creator.platform}</p>
                    <p className="text-sm text-gray-600">Followers: {creator.followers}</p>
                    <p className="text-sm text-gray-600">Engagement: {creator.engagement}</p>
                    <p className="text-sm text-gray-600">Price: {creator.priceRange}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {creator.skills.map(skill => (
                        <span key={skill} className="bg-secondary text-xs px-2 py-0.5 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4"
                    variant={selectedCreators.includes(creator.id) ? "default" : "outline"}
                    onClick={() => handleToggleCreator(creator.id)}
                  >
                    {selectedCreators.includes(creator.id) ? (
                      "Selected"
                    ) : (
                      <>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add to Project
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCreators.map(creator => (
              <Card key={creator.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="flex items-center flex-1">
                      <div className="relative">
                        <img 
                          src={creator.imageUrl} 
                          alt={creator.name} 
                          className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                        <div className="absolute -top-1 -right-1 bg-background/80 backdrop-blur-sm rounded-full px-1.5 py-0.5 text-xs font-medium border">
                          {creator.matchScore}%
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold">{creator.name}</h3>
                        <p className="text-sm text-gray-600">{creator.platform} · {creator.followers} followers</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {creator.skills.slice(0, 3).map(skill => (
                            <span key={skill} className="bg-secondary text-xs px-2 py-0.5 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block text-right mr-4">
                      <p className="font-medium">{creator.engagement} engagement</p>
                      <p className="text-sm text-gray-600">{creator.priceRange}</p>
                    </div>
                    <Button
                      variant={selectedCreators.includes(creator.id) ? "default" : "outline"}
                      onClick={() => handleToggleCreator(creator.id)}
                      className="mt-3 md:mt-0"
                    >
                      {selectedCreators.includes(creator.id) ? "Selected" : "Work with"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </BrandLayout>
  );
};

export default CreatorSearch;
