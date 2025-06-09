
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, ExternalLink, User } from 'lucide-react';
import { useAgencyCreators } from '@/hooks/agency/useAgencyCreators';

const AgencyCreatorCRM = () => {
  const { data: creators = [], isLoading, error } = useAgencyCreators();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Creator CRM</h1>
        </div>
        <div className="text-center py-8">Loading your managed creators...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Creator CRM</h1>
        </div>
        <div className="text-center py-8 text-red-500">Error loading creators</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Creator CRM</h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managed Creators</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creators.length}</div>
            <p className="text-xs text-muted-foreground">Creators under your management</p>
          </CardContent>
        </Card>
      </div>

      {creators.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No creators managed yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't been assigned any creators to manage yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => (
            <Card key={creator.user_id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={creator.avatar_url || undefined} />
                    <AvatarFallback>
                      {creator.first_name.charAt(0).toUpperCase()}{creator.last_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{creator.first_name} {creator.last_name}</h3>
                    <p className="text-sm text-muted-foreground">{creator.email}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {creator.primary_platform && (
                    <div>
                      <span className="text-sm font-medium">Platform: </span>
                      <span className="text-sm text-muted-foreground">{creator.primary_platform}</span>
                    </div>
                  )}
                  {creator.follower_count && (
                    <div>
                      <span className="text-sm font-medium">Followers: </span>
                      <span className="text-sm text-muted-foreground">
                        {creator.follower_count.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {creator.engagement_rate && (
                    <div>
                      <span className="text-sm font-medium">Engagement: </span>
                      <span className="text-sm text-muted-foreground">
                        {creator.engagement_rate}%
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <Badge variant={creator.status === 'active' ? 'default' : 'secondary'}>
                      {creator.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgencyCreatorCRM;
