import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { useRealAnalytics, getPerformanceBadge } from '@/hooks/brand/useRealAnalytics';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

const CampaignAnalytics = () => {
  const { user } = useUnifiedAuth();
  const {
    engagementData,
    reachData,
    audienceData,
    platformData,
    creatorPerformance,
    isLoading
  } = useRealAnalytics(user?.id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Engagement Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#000',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    color: '#fff'
                  }}
                />
                <Line type="monotone" dataKey="likes" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="comments" stroke="#82ca9d" strokeWidth={2} />
                <Line type="monotone" dataKey="shares" stroke="#ffc658" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Reach and Impressions */}
      <Card>
        <CardHeader>
          <CardTitle>Reach & Impressions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reachData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#000',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="reach" fill="#8884d8" />
                <Bar dataKey="impressions" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audience Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>Audience Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={audienceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {audienceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Platform Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#000',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="posts" fill="#8884d8" />
                  <Bar dataKey="engagement" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Creator Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Creator Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {creatorPerformance.map((creator) => (
              <div key={creator.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-foreground">{creator.name}</h3>
                    <p className="text-sm text-muted-foreground">{creator.handle}</p>
                    <p className="text-xs text-muted-foreground">{creator.platform}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-foreground">{creator.engagement}</div>
                    <div className="text-muted-foreground">Engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-foreground">{creator.reach}</div>
                    <div className="text-muted-foreground">Reach</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-foreground">{creator.posts}</div>
                    <div className="text-muted-foreground">Posts</div>
                  </div>
                  <Badge className={getPerformanceBadge(creator.performance)}>
                    {creator.performance}
                  </Badge>
                </div>
              </div>
            ))}
            {creatorPerformance.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No creator performance data available yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignAnalytics;
