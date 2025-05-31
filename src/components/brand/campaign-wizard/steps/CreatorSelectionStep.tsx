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

  const filteredCreators = mockCreators.filter(creator =>
    creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalBudget = data?.total_budget || 0;
  const totalSelectedBudget = Object.values(creatorBudgets).reduce((sum, budget) => sum + budget, 0);
  const remainingBudget = totalBudget * 0.75 - totalSelectedBudget; // 75% for creators

  const handleCreatorToggle = (creatorId: string, checked: boolean) => {
    if (checked) {
      setSelectedCreators([...selectedCreators, creatorId]);
      const creator = mockCreators.find(c => c.id === creatorId);
      if (creator) {
        setCreatorBudgets(prev => ({
          ...prev,
          [creatorId]: creator.rate_per_post
        }));
      }
    } else {
      setSelectedCreators(selectedCreators.filter(id => id !== creatorId));
      setCreatorBudgets(prev => {
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

  const handleContinue = () => {
    const selected_creators = selectedCreators.map(creatorId => ({
      creator_id: creatorId,
      individual_budget: creatorBudgets[creatorId] || 0,
      custom_requirements: {}
    }));

    onComplete({ selected_creators });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            👥 Select Creators
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search creators by name, handle, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Budget Overview */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Creator Budget Allocation</span>
              <span className="text-sm text-blue-600">
                ${totalSelectedBudget.toFixed(2)} / ${(totalBudget * 0.75).toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((totalSelectedBudget / (totalBudget * 0.75)) * 100, 100)}%` }}
              />
            </div>
            <p className="text-sm text-blue-700 mt-1">
              Remaining: ${remainingBudget.toFixed(2)}
            </p>
          </div>

          {/* Selected Creators Summary */}
          {selectedCreators.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">
                Selected Creators ({selectedCreators.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedCreators.map(creatorId => {
                  const creator = mockCreators.find(c => c.id === creatorId);
                  return creator ? (
                    <Badge key={creatorId} variant="secondary">
                      {creator.name} - ${creatorBudgets[creatorId] || 0}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Creator Grid */}
          <div className="space-y-4">
            {filteredCreators.map((creator) => {
              const isSelected = selectedCreators.includes(creator.id);
              
              return (
                <div
                  key={creator.id}
                  className={`
                    border rounded-lg p-4 transition-all
                    ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => 
                          handleCreatorToggle(creator.id, checked as boolean)
                        }
                        className="mt-1"
                      />
                      
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={creator.avatar} alt={creator.name} />
                        <AvatarFallback>{creator.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div>
                          <h3 className="font-semibold">{creator.name}</h3>
                          <p className="text-sm text-gray-600">{creator.handle}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {creator.platforms.map(platform => (
                            <Badge key={platform} variant="outline" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                          {creator.categories.map(category => (
                            <Badge key={category} variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-gray-400" />
                            <span>{formatNumber(creator.followers)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3 text-gray-400" />
                            <span>{formatNumber(creator.avg_likes)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3 text-gray-400" />
                            <span>{formatNumber(creator.avg_comments)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3 text-gray-400" />
                            <span>{creator.engagement_rate}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <div className="text-sm text-gray-600">Suggested Rate</div>
                      <div className="font-semibold">${creator.rate_per_post}</div>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <div className="flex items-center gap-4">
                        <Label className="text-sm font-medium whitespace-nowrap">
                          Your Budget:
                        </Label>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <Input
                            type="number"
                            value={creatorBudgets[creator.id] || 0}
                            onChange={(e) => handleBudgetChange(creator.id, Number(e.target.value))}
                            className="w-24"
                            min="0"
                            max={remainingBudget + (creatorBudgets[creator.id] || 0)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={selectedCreators.length === 0 || remainingBudget < 0 || isLoading}
          className="flex items-center gap-2"
        >
          Continue to Review
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CreatorSelectionStep;