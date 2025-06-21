
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, ArrowLeft, Search, Users, DollarSign, Eye, Heart, MessageCircle } from 'lucide-react';
import { CampaignWizardData } from '@/types/campaignWizard';

interface CreatorSelectionStepProps {
  data?: Partial<CampaignWizardData>;
  onComplete: (data: Partial<CampaignWizardData>) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

// Mock creator data for demonstration
const mockCreators = [
  {
    id: '1',
    name: 'Sarah Johnson',
    handle: '@sarahjstyle',
    followers: 125000,
    engagement_rate: 4.2,
    avatar: '/placeholder.svg',
    platforms: ['instagram', 'tiktok'],
    categories: ['fashion', 'lifestyle'],
    recent_posts: 15,
    avg_likes: 5200,
    avg_comments: 142,
    rate_per_post: 850
  },
  {
    id: '2',
    name: 'Mike Chen',
    handle: '@mikecooks',
    followers: 89000,
    engagement_rate: 3.8,
    avatar: '/placeholder.svg',
    platforms: ['youtube', 'instagram'],
    categories: ['food', 'cooking'],
    recent_posts: 8,
    avg_likes: 3400,
    avg_comments: 89,
    rate_per_post: 620
  },
  {
    id: '3',
    name: 'Emma Davis',
    handle: '@emmafitness',
    followers: 67000,
    engagement_rate: 5.1,
    avatar: '/placeholder.svg',
    platforms: ['instagram', 'tiktok'],
    categories: ['fitness', 'wellness'],
    recent_posts: 22,
    avg_likes: 3100,
    avg_comments: 156,
    rate_per_post: 490
  },
  {
    id: '4',
    name: 'Alex Rivera',
    handle: '@alextech',
    followers: 156000,
    engagement_rate: 3.2,
    avatar: '/placeholder.svg',
    platforms: ['youtube', 'twitter'],
    categories: ['technology', 'gadgets'],
    recent_posts: 12,
    avg_likes: 4800,
    avg_comments: 98,
    rate_per_post: 1200
  }
];

const CreatorSelectionStep: React.FC<CreatorSelectionStepProps> = ({
  data,
  onComplete,
  onBack,
  isLoading
}) => {
  const [selectedCreators, setSelectedCreators] = useState<string[]>(
    data?.selected_creators?.map(c => c.creator_id) || []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [creatorBudgets, setCreatorBudgets] = useState<Record<string, number>>(
    data?.selected_creators?.reduce((acc, creator) => ({
      ...acc,
      [creator.creator_id]: creator.individual_budget
    }), {}) || {}
  );

  // Add state for deliverables per creator
  const [creatorDeliverables, setCreatorDeliverables] = useState<Record<string, {
    posts_count: number;
    stories_count: number;
    reels_count: number;
  }>>(
    data?.selected_creators?.reduce((acc, creator) => ({
      ...acc,
      [creator.creator_id]: creator.custom_requirements || {
        posts_count: data?.deliverables?.posts_count || 1,
        stories_count: data?.deliverables?.stories_count || 0,
        reels_count: data?.deliverables?.reels_count || 0
      }
    }), {}) || {}
  );

  const filteredCreators = mockCreators.filter(creator =>
    creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalBudget = data?.total_budget || 0;
  const totalSelectedBudget = Object.values(creatorBudgets).reduce((sum, budget) => sum + budget, 0);
  const remainingBudget = totalBudget - totalSelectedBudget;

  const handleCreatorToggle = (creatorId: string, checked: boolean) => {
    if (checked) {
      setSelectedCreators([...selectedCreators, creatorId]);
      const creator = mockCreators.find(c => c.id === creatorId);
      if (creator) {
        setCreatorBudgets(prev => ({
          ...prev,
          [creatorId]: creator.rate_per_post
        }));
        // Set default deliverables from campaign requirements
        setCreatorDeliverables(prev => ({
          ...prev,
          [creatorId]: {
            posts_count: data?.deliverables?.posts_count || 1,
            stories_count: data?.deliverables?.stories_count || 0,
            reels_count: data?.deliverables?.reels_count || 0
          }
        }));
      }
    } else {
      setSelectedCreators(selectedCreators.filter(id => id !== creatorId));
      setCreatorBudgets(prev => {
        const { [creatorId]: removed, ...rest } = prev;
        return rest;
      });
      setCreatorDeliverables(prev => {
        const { [creatorId]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleBudgetChange = (creatorId: string, budget: number) => {
    setCreatorBudgets(prev => ({
      ...prev,
      [creatorId]: budget
    }));
  };

  const handleDeliverableChange = (creatorId: string, field: 'posts_count' | 'stories_count' | 'reels_count', value: number) => {
    setCreatorDeliverables(prev => ({
      ...prev,
      [creatorId]: {
        ...prev[creatorId],
        [field]: value
      }
    }));
  };

  const handleContinue = () => {
    const selected_creators = selectedCreators.map(creatorId => ({
      creator_id: creatorId,
      individual_budget: creatorBudgets[creatorId] || 0,
      custom_requirements: creatorDeliverables[creatorId] || {
        posts_count: data?.deliverables?.posts_count || 1,
        stories_count: data?.deliverables?.stories_count || 0,
        reels_count: data?.deliverables?.reels_count || 0
      }
    }));

    onComplete({ selected_creators });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-6 bg-black min-h-screen p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Users className="h-8 w-8 text-white" />
          <h1 className="text-4xl font-light text-white">Select Creators</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search creators by name, handle, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 text-lg bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-white"
          />
        </div>
      </div>

      {/* Budget Overview Card */}
      <Card className="max-w-4xl mx-auto bg-gray-900 border-gray-700">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white font-medium text-lg">Creator Budget Allocation</span>
            <span className="text-blue-400 text-lg font-medium">
              ${totalSelectedBudget.toFixed(2)} / ${totalBudget.toFixed(2)}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((totalSelectedBudget / totalBudget) * 100, 100)}%` }}
            />
          </div>
          
          <p className="text-blue-400 text-lg">
            Remaining: ${remainingBudget.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      {/* Selected Creators Summary */}
      {selectedCreators.length > 0 && (
        <Card className="max-w-4xl mx-auto bg-green-900/20 border-green-700">
          <CardContent className="p-6">
            <h4 className="font-medium text-green-300 text-lg mb-3">
              Selected Creators ({selectedCreators.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedCreators.map(creatorId => {
                const creator = mockCreators.find(c => c.id === creatorId);
                const deliverables = creatorDeliverables[creatorId];
                return creator ? (
                  <Badge key={creatorId} variant="secondary" className="bg-green-800 text-green-100 text-sm py-1 px-3">
                    {creator.name} - ${creatorBudgets[creatorId] || 0} 
                    {deliverables && (
                      <span className="ml-2 text-xs">
                        ({deliverables.posts_count}p, {deliverables.stories_count}s, {deliverables.reels_count}r)
                      </span>
                    )}
                  </Badge>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Creator Grid */}
      <div className="max-w-4xl mx-auto space-y-4">
        {filteredCreators.map((creator) => {
          const isSelected = selectedCreators.includes(creator.id);
          const deliverables = creatorDeliverables[creator.id] || {
            posts_count: data?.deliverables?.posts_count || 1,
            stories_count: data?.deliverables?.stories_count || 0,
            reels_count: data?.deliverables?.reels_count || 0
          };
          
          return (
            <Card
              key={creator.id}
              className={`
                transition-all duration-200 cursor-pointer
                ${isSelected 
                  ? 'bg-blue-900/30 border-blue-500 shadow-lg shadow-blue-500/20' 
                  : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                }
              `}
              onClick={() => handleCreatorToggle(creator.id, !isSelected)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => 
                        handleCreatorToggle(creator.id, checked as boolean)
                      }
                      className="mt-2"
                      onClick={(e) => e.stopPropagation()}
                    />
                    
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={creator.avatar} alt={creator.name} />
                      <AvatarFallback className="text-xl">{creator.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-white text-xl">{creator.name}</h3>
                        <p className="text-gray-400 text-lg">{creator.handle}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {creator.platforms.map(platform => (
                          <Badge key={platform} variant="outline" className="text-gray-300 border-gray-600">
                            {platform}
                          </Badge>
                        ))}
                        {creator.categories.map(category => (
                          <Badge key={category} variant="secondary" className="bg-gray-700 text-gray-200">
                            {category}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-4 gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-white">{formatNumber(creator.followers)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-gray-400" />
                          <span className="text-white">{formatNumber(creator.avg_likes)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-gray-400" />
                          <span className="text-white">{formatNumber(creator.avg_comments)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-gray-400" />
                          <span className="text-white">{creator.engagement_rate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2 ml-4">
                    <div className="text-sm text-gray-400">Suggested Rate</div>
                    <div className="font-semibold text-white text-lg">${creator.rate_per_post}</div>
                  </div>
                </div>
                
                {isSelected && (
                  <div className="mt-6 pt-6 border-t border-blue-700 space-y-4">
                    {/* Budget Input */}
                    <div className="flex items-center gap-4">
                      <Label className="text-sm font-medium text-blue-300 whitespace-nowrap">
                        Your Budget:
                      </Label>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <Input
                          type="number"
                          value={creatorBudgets[creator.id] || 0}
                          onChange={(e) => handleBudgetChange(creator.id, Number(e.target.value))}
                          onClick={(e) => e.stopPropagation()}
                          className="w-32 bg-gray-800 border-gray-600 text-white"
                          min="0"
                          max={remainingBudget + (creatorBudgets[creator.id] || 0)}
                        />
                      </div>
                    </div>

                    {/* Deliverables Inputs */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-blue-300">
                        Content Deliverables for this Creator:
                      </Label>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-400">Posts</Label>
                          <Input
                            type="number"
                            value={deliverables.posts_count}
                            onChange={(e) => handleDeliverableChange(creator.id, 'posts_count', Number(e.target.value))}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-gray-800 border-gray-600 text-white"
                            min="0"
                            max="50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-400">Stories</Label>
                          <Input
                            type="number"
                            value={deliverables.stories_count}
                            onChange={(e) => handleDeliverableChange(creator.id, 'stories_count', Number(e.target.value))}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-gray-800 border-gray-600 text-white"
                            min="0"
                            max="50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-400">Reels</Label>
                          <Input
                            type="number"
                            value={deliverables.reels_count}
                            onChange={(e) => handleDeliverableChange(creator.id, 'reels_count', Number(e.target.value))}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-gray-800 border-gray-600 text-white"
                            min="0"
                            max="20"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="max-w-4xl mx-auto flex justify-between pt-8">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2 bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={selectedCreators.length === 0 || remainingBudget < 0 || isLoading}
          className="flex items-center gap-2 bg-white text-black hover:bg-gray-200"
        >
          Continue to Review
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CreatorSelectionStep;
