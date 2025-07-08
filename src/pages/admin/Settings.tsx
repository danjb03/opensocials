import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

const AdminSettings = () => {
  const { user } = useUnifiedAuth();
  const [settings, setSettings] = useState({
    theme: 'light',
    notificationsEnabled: true,
  });

  useEffect(() => {
    // Load settings from local storage or database
    // For now, let's just simulate loading
    setTimeout(() => {
      setSettings({
        theme: 'dark',
        notificationsEnabled: false,
      });
    }, 500);
  }, []);

  const handleThemeChange = (theme: string) => {
    setSettings({ ...settings, theme });
  };

  const handleNotificationsChange = (enabled: boolean) => {
    setSettings({ ...settings, notificationsEnabled: enabled });
  };

  const handleSaveSettings = () => {
    // Save settings to local storage or database
    alert('Settings saved!');
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed text-gray-700">
              Theme
            </label>
            <div className="flex mt-2">
              <Button
                variant={settings.theme === 'light' ? 'default' : 'outline'}
                className="mr-2"
                onClick={() => handleThemeChange('light')}
              >
                Light
              </Button>
              <Button
                variant={settings.theme === 'dark' ? 'default' : 'outline'}
                onClick={() => handleThemeChange('dark')}
              >
                Dark
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed text-gray-700">
              Notifications
            </label>
            <div className="flex mt-2">
              <Button
                variant={settings.notificationsEnabled ? 'default' : 'outline'}
                className="mr-2"
                onClick={() => handleNotificationsChange(true)}
              >
                Enabled
              </Button>
              <Button
                variant={!settings.notificationsEnabled ? 'default' : 'outline'}
                onClick={() => handleNotificationsChange(false)}
              >
                Disabled
              </Button>
            </div>
          </div>

          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
