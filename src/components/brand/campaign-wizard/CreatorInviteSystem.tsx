
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Plus, Send, DollarSign, Users, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CreatorInviteSystemProps {
  projectId: string;
  remainingBudget: number;
  currency?: string;
}

interface CreatorCandidate {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
}

const CreatorInviteSystem: React.FC<CreatorInviteSystemProps> = ({
  projectId,
  remainingBudget,
  currency = 'USD'
}) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [creatorBudgets, setCreatorBudgets] = useState<Record<string, number>>({});

  // Fetch available creators
  const { data: availableCreators, isLoading } = useQuery({
    queryKey: ['available-creators', searchTerm],
    queryFn: async (): Promise<CreatorCandidate[]> => {
      let query = supabase
        .from('creator_profiles')
        .select(`
          id,
          user_id,
          first_name,
          last_name
        `)
        .limit(20);

      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: true
  });

  // Invite creator mutation
  const inviteCreatorMutation = useMutation({
    mutationFn: async ({
      creatorId,
      agreedAmount,
    }: {
      creatorId: string;
      agreedAmount: number;
    }) => {
      const { data, error } = await supabase.functions.invoke('invite-creator-to-project', {
        body: {
          project_id: projectId,
          creator_id: creatorId,
          agreed_amount: agreedAmount,
          currency,
          notes: 'Rolling campaign invitation'
        }
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to send invitation');
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['project-creators', projectId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send invitation');
    }
  });

  const handleCreatorSelect = (creatorId: string, budget: number) => {
    setSelectedCreators(prev => 
      prev.includes(creatorId) 
        ? prev.filter(id => id !== creatorId)
        : [...prev, creatorId]
    );
    
    if (budget > 0) {
      setCreatorBudgets(prev => ({
        ...prev,
        [creatorId]: budget
      }));
    }
  };

  const handleBudgetChange = (creatorId: string, budget: number) => {
    setCreatorBudgets(prev => ({
      ...prev,
      [creatorId]: budget
    }));
  };

  const handleSendInvites = async () => {
    const totalAllocated = Object.values(creatorBudgets).reduce((sum, budget) => sum + budget, 0);
    
    if (totalAllocated > remainingBudget) {
      toast.error(`Total budget (${totalAllocated}) exceeds remaining budget (${remainingBudget})`);
      return;
    }

    try {
      // Send invitations to all selected creators
      await Promise.all(
        selectedCreators.map(creatorId => 
          inviteCreatorMutation.mutateAsync({
            creatorId,
            agreedAmount: creatorBudgets[creatorId] || 0,
          })
        )
      );

      toast.success(`Sent invitations to ${selectedCreators.length} creators`);
      setSelectedCreators([]);
      setCreatorBudgets({});
      queryClient.invalidateQueries({ queryKey: ['project-creators', projectId] });
    } catch (error) {
      console.error('Failed to send invitations:', error);
    }
  };

  const totalAllocated = Object.values(creatorBudgets).reduce((sum, budget) => sum + budget, 0);
  const canSendInvites = selectedCreators.length > 0 && totalAllocated <= remainingBudget && totalAllocated > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Invite Additional Creators
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            Remaining Budget: ${remainingBudget.toFixed(2)}
          </div>
          {selectedCreators.length > 0 && (
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Allocated: ${totalAllocated.toFixed(2)}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="flex gap-2">
          <Input
            placeholder="Search creators by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleSendInvites}
            disabled={!canSendInvites || inviteCreatorMutation.isPending}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Send Invites ({selectedCreators.length})
          </Button>
        </div>

        {/* Selected Creators Summary */}
        {selectedCreators.length > 0 && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">
                {selectedCreators.length} creator{selectedCreators.length > 1 ? 's' : ''} selected
              </span>
              <span className={`font-medium ${totalAllocated > remainingBudget ? 'text-red-600' : 'text-green-600'}`}>
                ${totalAllocated.toFixed(2)} / ${remainingBudget.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        <Separator />

        {/* Creator List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                  </div>
                  <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : availableCreators && availableCreators.length > 0 ? (
            availableCreators.map((creator) => {
              const isSelected = selectedCreators.includes(creator.user_id);
              const creatorName = creator.first_name && creator.last_name 
                ? `${creator.first_name} ${creator.last_name}`
                : creator.first_name || 'Unknown Creator';

              return (
                <div 
                  key={creator.id} 
                  className={`flex items-center gap-3 p-3 border rounded-lg transition-all ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                  }`}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{creatorName?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{creatorName}</h4>
                      <Badge variant="outline" className="text-xs">
                        Creator
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Creator Profile</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <Input
                        type="number"
                        placeholder="Budget"
                        value={creatorBudgets[creator.user_id] || ''}
                        onChange={(e) => handleBudgetChange(creator.user_id, Number(e.target.value))}
                        className="w-24 h-8 text-sm"
                        min="0"
                        max={remainingBudget}
                      />
                    )}
                    <Button
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => handleCreatorSelect(creator.user_id, 500)} // Default budget suggestion
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      {isSelected ? 'Selected' : 'Invite'}
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No creators found</p>
              <p className="text-sm">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatorInviteSystem;
