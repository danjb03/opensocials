
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Grid2x2, List, PlusCircle } from 'lucide-react';

// Mock creator data - in a real application, this would come from the database
const mockCreators = [
  { id: 1, name: 'Alex Johnson', platform: 'instagram', audience: 'gen-z', contentType: 'photo', followers: '120K', engagement: '3.5%', priceRange: '$500-1000', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: 2, name: 'Sam Rivera', platform: 'youtube', audience: 'millennials', contentType: 'video', followers: '250K', engagement: '4.2%', priceRange: '$1000-2000', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: 3, name: 'Jamie Chen', platform: 'tiktok', audience: 'gen-z', contentType: 'video', followers: '500K', engagement: '5.8%', priceRange: '$1500-3000', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: 4, name: 'Taylor Singh', platform: 'instagram', audience: 'millennials', contentType: 'photo', followers: '80K', engagement: '3.2%', priceRange: '$300-800', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: 5, name: 'Morgan Lee', platform: 'twitter', audience: 'gen-x', contentType: 'blog', followers: '45K', engagement: '2.8%', priceRange: '$250-600', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: 6, name: 'Casey Wilson', platform: 'youtube', audience: 'boomers', contentType: 'review', followers: '110K', engagement: '3.9%', priceRange: '$600-1200', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
];

const CreatorSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCreators, setSelectedCreators] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState(searchParams.get('platform') || 'all');
  const [filterAudience, setFilterAudience] = useState(searchParams.get('audience') || 'all');
  const [filterContentType, setFilterContentType] = useState(searchParams.get('contentType') || 'all');
  const { toast } = useToast();

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    if (filterPlatform && filterPlatform !== 'all') params.set('platform', filterPlatform);
    if (filterAudience && filterAudience !== 'all') params.set('audience', filterAudience);
    if (filterContentType && filterContentType !== 'all') params.set('contentType', filterContentType);
    setSearchParams(params);
  }, [filterPlatform, filterAudience, filterContentType, setSearchParams]);

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

    // In a real app, you'd likely store this in global state or localStorage
    console.log("Selected creators:", selectedCreators);
    
    // For demo purposes, clear selection after adding to cart
    setSelectedCreators([]);
  };

  // Filter creators based on search and dropdown selections
  const filteredCreators = mockCreators.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === 'all' || creator.platform === filterPlatform;
    const matchesAudience = filterAudience === 'all' || creator.audience === filterAudience;
    const matchesContentType = filterContentType === 'all' || creator.contentType === filterContentType;
    
    return matchesSearch && matchesPlatform && matchesAudience && matchesContentType;
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
        
        {/* Search and Filters */}
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
              
              <div>
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
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Selected Creators Cart */}
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
        
        {/* Creators List/Grid */}
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
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg">{creator.name}</h3>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm text-gray-600">Platform: {creator.platform}</p>
                    <p className="text-sm text-gray-600">Followers: {creator.followers}</p>
                    <p className="text-sm text-gray-600">Engagement: {creator.engagement}</p>
                    <p className="text-sm text-gray-600">Price: {creator.priceRange}</p>
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
                  <div className="flex items-center">
                    <img 
                      src={creator.imageUrl} 
                      alt={creator.name} 
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold">{creator.name}</h3>
                      <p className="text-sm text-gray-600">{creator.platform} · {creator.followers} followers</p>
                    </div>
                    <div className="hidden md:block text-right mr-4">
                      <p className="font-medium">{creator.engagement} engagement</p>
                      <p className="text-sm text-gray-600">{creator.priceRange}</p>
                    </div>
                    <Button
                      variant={selectedCreators.includes(creator.id) ? "default" : "outline"}
                      onClick={() => handleToggleCreator(creator.id)}
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
