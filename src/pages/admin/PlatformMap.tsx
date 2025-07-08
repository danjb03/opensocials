import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

interface PlatformMapping {
  [key: string]: string;
}

const PlatformMap = () => {
  const { role } = useUnifiedAuth();
  const [platformMappings, setPlatformMappings] = useState<PlatformMapping>({
    instagram: 'Instagram',
    tiktok: 'TikTok',
    youtube: 'YouTube',
    linkedin: 'LinkedIn',
    twitter: 'X',
    facebook: 'Facebook',
    twitch: 'Twitch',
  });

  const handleInputChange = (platform: string, value: string) => {
    setPlatformMappings(prev => ({
      ...prev,
      [platform]: value,
    }));
  };

  const handleSubmit = () => {
    // Placeholder for actual submission logic
    console.log('Platform Mappings:', platformMappings);
    alert('Platform mappings submitted (console logged)');
  };

  const isAdmin = useMemo(() => role === 'admin' || role === 'super_admin', [role]);

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              You do not have permission to view this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Mapping</CardTitle>
          <p className="text-sm text-muted-foreground">
            Map internal platform names to user-friendly names.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(platformMappings).map(([platform, mappedName]) => (
            <div key={platform} className="flex items-center justify-between">
              <div className="w-32 font-medium">{platform}:</div>
              <Input
                type="text"
                value={mappedName}
                onChange={(e) => handleInputChange(platform, e.target.value)}
                className="w-64"
              />
            </div>
          ))}
          <Button onClick={handleSubmit}>Submit</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformMap;
