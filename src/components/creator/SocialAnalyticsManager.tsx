
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Instagram, 
  Youtube, 
  Linkedin, 
  Twitter,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2,
  Edit3,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PlatformData {
  username: string;
  isConnected: boolean;
  isLoading: boolean;
  error?: string;
  lastSynced?: Date;
  analytics?: {
    followers: number;
    engagement_rate: number;
    avg_likes: number;
    avg_comments: number;
    avg_views: number;
    growth_rate: number;
    verified: boolean;
  };
}

interface Platform {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
}

const platforms: Platform[] = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'from-purple-500 to-pink-500', bgColor: 'bg-gradient-to-r from-purple-50 to-pink-50', borderColor: 'border-purple-200' },
  { id: 'tiktok', name: 'TikTok', icon: () => <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center text-white text-xs font-bold">T</div>, color: 'from-gray-800 to-black', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'from-blue-600 to-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'from-blue-400 to-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { id: 'twitch', name: 'Twitch', icon: () => <div className="w-5 h-5 bg-purple-600 rounded text-white text-xs font-bold flex items-center justify-center">T</div>, color: 'from-purple-600 to-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  { id: 'pinterest', name: 'Pinterest', icon: () => <div className="w-5 h-5 bg-red-600 rounded-full text-white text-xs font-bold flex items-center justify-center">P</div>, color: 'from-red-600 to-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  { id: 'facebook', name: 'Facebook', icon: () => <div className="w-5 h-5 bg-blue-600 rounded text-white text-xs font-bold flex items-center justify-center">f</div>, color: 'from-blue-600 to-blue-800', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { id: 'discord', name: 'Discord', icon: () => <div className="w-5 h-5 bg-indigo-600 rounded text-white text-xs font-bold flex items-center justify-center">D</div>, color: 'from-indigo-600 to-indigo-700', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
  { id: 'reddit', name: 'Reddit', icon: () => <div className="w-5 h-5 bg-orange-600 rounded-full text-white text-xs font-bold flex items-center justify-center">R</div>, color: 'from-orange-600 to-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  { id: 'spotify', name: 'Spotify', icon: () => <div className="w-5 h-5 bg-green-600 rounded-full text-white text-xs font-bold flex items-center justify-center">S</div>, color: 'from-green-600 to-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  { id: 'patreon', name: 'Patreon', icon: () => <div className="w-5 h-5 bg-red-500 rounded text-white text-xs font-bold flex items-center justify-center">P</div>, color: 'from-red-500 to-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  { id: 'shopify', name: 'Shopify', icon: () => <div className="w-5 h-5 bg-green-700 rounded text-white text-xs font-bold flex items-center justify-center">S</div>, color: 'from-green-700 to-green-800', bgColor: 'bg-green-50', borderColor: 'border-green-200' }
];

export const SocialAnalyticsManager: React.FC = () => {
  const [platformStates, setPlatformStates] = useState<Record<string, PlatformData>>(
    platforms.reduce((acc, platform) => ({
      ...acc,
      [platform.id]: {
        username: '',
        isConnected: false,
        isLoading: false
      }
    }), {})
  );

  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatTime = (date: Date): string => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.floor((date.getTime() - Date.now()) / (1000 * 60)),
      'minute'
    );
  };

  const connectPlatform = async (platformId: string) => {
    const username = platformStates[platformId].username.trim();
    if (!username) {
      toast.error('Please enter a username');
      return;
    }

    setPlatformStates(prev => ({
      ...prev,
      [platformId]: { ...prev[platformId], isLoading: true, error: undefined }
    }));

    try {
      const { data, error } = await supabase.functions.invoke('insightiq', {
        body: { platform: platformId, username }
      });

      if (error) {
        throw new Error(error.message || 'Failed to connect platform');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch analytics data');
      }

      setPlatformStates(prev => ({
        ...prev,
        [platformId]: {
          ...prev[platformId],
          isConnected: true,
          isLoading: false,
          error: undefined,
          lastSynced: new Date(),
          analytics: data.data
        }
      }));

      setEditingPlatform(null);
      toast.success(`${platforms.find(p => p.id === platformId)?.name} connected successfully!`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setPlatformStates(prev => ({
        ...prev,
        [platformId]: {
          ...prev[platformId],
          isLoading: false,
          error: errorMessage,
          isConnected: false
        }
      }));

      toast.error(`Failed to connect ${platforms.find(p => p.id === platformId)?.name}: ${errorMessage}`);
    }
  };

  const refreshPlatformData = async (platformId: string) => {
    const platformData = platformStates[platformId];
    if (!platformData.username) return;

    setPlatformStates(prev => ({
      ...prev,
      [platformId]: { ...prev[platformId], isLoading: true, error: undefined }
    }));

    try {
      const { data, error } = await supabase.functions.invoke('insightiq', {
        body: { platform: platformId, username: platformData.username }
      });

      if (error) {
        throw new Error(error.message || 'Failed to refresh data');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch updated analytics');
      }

      setPlatformStates(prev => ({
        ...prev,
        [platformId]: {
          ...prev[platformId],
          isLoading: false,
          error: undefined,
          lastSynced: new Date(),
          analytics: data.data
        }
      }));

      toast.success(`${platforms.find(p => p.id === platformId)?.name} data refreshed!`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setPlatformStates(prev => ({
        ...prev,
        [platformId]: {
          ...prev[platformId],
          isLoading: false,
          error: errorMessage
        }
      }));

      toast.error(`Failed to refresh ${platforms.find(p => p.id === platformId)?.name}: ${errorMessage}`);
    }
  };

  const updateUsername = (platformId: string, username: string) => {
    setPlatformStates(prev => ({
      ...prev,
      [platformId]: { ...prev[platformId], username }
    }));
  };

  const renderPlatformCard = (platform: Platform) => {
    const state = platformStates[platform.id];
    const IconComponent = platform.icon;
    const isEditing = editingPlatform === platform.id;
    const canEdit = !state.isConnected || isEditing;

    return (
      <Card 
        key={platform.id} 
        className={`transition-all duration-200 ${platform.bgColor} ${platform.borderColor} ${
          state.error ? 'ring-2 ring-red-200 border-red-300' : state.isConnected ? 'ring-2 ring-green-200 border-green-300' : ''
        }`}
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${platform.color}`}>
                <IconComponent className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">{platform.name}</span>
            </div>
            
            {state.isConnected && (
              <div className="flex items-center gap-2">
                {state.analytics?.verified && (
                  <Badge className="bg-blue-100 text-blue-800 text-xs">Verified</Badge>
                )}
                <Badge className="bg-green-100 text-green-800 text-xs flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Connected
                </Badge>
              </div>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Username Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter your handle"
              value={state.username}
              onChange={(e) => updateUsername(platform.id, e.target.value)}
              disabled={state.isLoading || (state.isConnected && !isEditing)}
              className={`flex-1 bg-white/80 backdrop-blur-sm border-white/50 focus:border-white focus:ring-2 focus:ring-white/20 ${
                state.error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''
              }`}
            />
            
            {state.isConnected && !isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingPlatform(platform.id)}
                className="shrink-0"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={() => connectPlatform(platform.id)}
                disabled={state.isLoading || !state.username.trim()}
                className={`shrink-0 bg-gradient-to-r ${platform.color} hover:opacity-90 text-white border-0 shadow-md`}
                size="sm"
              >
                {state.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Connect'
                )}
              </Button>
            )}
          </div>

          {/* Error State */}
          {state.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Connection Error</span>
              </div>
              <p className="text-xs text-red-600 mb-2">{state.error}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => connectPlatform(platform.id)}
                disabled={state.isLoading || !state.username.trim()}
                className="text-red-700 border-red-300 hover:bg-red-50"
              >
                Retry Connection
              </Button>
            </div>
          )}

          {/* Analytics Display */}
          {state.isConnected && state.analytics && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/50 rounded-lg border border-white/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-gray-600" />
                    <span className="text-xs font-medium text-gray-600">Followers</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {formatNumber(state.analytics.followers)}
                  </p>
                </div>
                
                <div className="p-3 bg-white/50 rounded-lg border border-white/30">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-gray-600" />
                    <span className="text-xs font-medium text-gray-600">Engagement</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {state.analytics.engagement_rate.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/30">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Clock className="h-3 w-3" />
                  <span>
                    Last synced: {state.lastSynced ? formatTime(state.lastSynced) : 'Never'}
                  </span>
                </div>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => refreshPlatformData(platform.id)}
                  disabled={state.isLoading}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {state.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Connected Username Display */}
          {state.isConnected && state.username && !isEditing && (
            <div className="p-2 bg-white/30 rounded border border-white/40">
              <span className="text-sm text-gray-700">@{state.username}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Social Analytics Manager</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Connect your social media accounts to display real-time analytics and engagement metrics to potential brand partners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[800px] overflow-y-auto pr-2">
        {platforms.map(renderPlatformCard)}
      </div>

      <div className="text-center pt-4 border-t border-gray-100">
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          <span>Real-time analytics powered by</span>
          <span className="font-semibold text-gray-700">InsightIQ</span>
        </p>
      </div>
    </div>
  );
};
