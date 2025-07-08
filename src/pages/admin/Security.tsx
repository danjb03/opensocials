import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Shield, Key, AlertTriangle, Eye, EyeOff, Lock, Unlock, RefreshCw, Save, Settings, Users, Database, Activity } from 'lucide-react';

interface SecuritySettings {
  two_factor_required: boolean;
  password_min_length: number;
  session_timeout: number;
  max_login_attempts: number;
  lockout_duration: number;
  require_password_change: boolean;
  password_change_interval: number;
  audit_logging: boolean;
  ip_whitelist_enabled: boolean;
  allowed_ips: string[];
}

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  timestamp: string;
  ip_address: string;
  user_agent: string;
  success: boolean;
}

const Security = () => {
  const { user, role } = useUnifiedAuth();
  const [settings, setSettings] = useState<SecuritySettings>({
    two_factor_required: false,
    password_min_length: 8,
    session_timeout: 30,
    max_login_attempts: 5,
    lockout_duration: 15,
    require_password_change: false,
    password_change_interval: 90,
    audit_logging: true,
    ip_whitelist_enabled: false,
    allowed_ips: []
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newIp, setNewIp] = useState('');
  const [showApiKeys, setShowApiKeys] = useState(false);

  useEffect(() => {
    fetchSecuritySettings();
    fetchAuditLogs();
  }, []);

  const fetchSecuritySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('security_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching security settings:', error);
        toast.error('Failed to load security settings');
        return;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching security settings:', error);
      toast.error('Failed to load security settings');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching audit logs:', error);
        return;
      }

      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  const saveSecuritySettings = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('security_settings')
        .upsert(settings);

      if (error) {
        console.error('Error saving security settings:', error);
        toast.error('Failed to save security settings');
        return;
      }

      toast.success('Security settings saved successfully');
    } catch (error) {
      console.error('Error saving security settings:', error);
      toast.error('Failed to save security settings');
    } finally {
      setIsSaving(false);
    }
  };

  const addIpToWhitelist = () => {
    if (!newIp.trim()) return;
    
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(newIp.trim())) {
      toast.error('Please enter a valid IP address');
      return;
    }

    if (settings.allowed_ips.includes(newIp.trim())) {
      toast.error('IP address already in whitelist');
      return;
    }

    setSettings(prev => ({
      ...prev,
      allowed_ips: [...prev.allowed_ips, newIp.trim()]
    }));
    setNewIp('');
  };

  const removeIpFromWhitelist = (ip: string) => {
    setSettings(prev => ({
      ...prev,
      allowed_ips: prev.allowed_ips.filter(allowedIp => allowedIp !== ip)
    }));
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return <Key className="h-4 w-4" />;
      case 'logout':
        return <Unlock className="h-4 w-4" />;
      case 'create':
        return <Plus className="h-4 w-4" />;
      case 'update':
        return <Edit className="h-4 w-4" />;
      case 'delete':
        return <Trash className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Settings</h1>
          <p className="text-muted-foreground">Manage platform security and access controls</p>
        </div>
        <Button onClick={saveSecuritySettings} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authentication Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Require Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Force all users to enable 2FA</p>
              </div>
              <Switch
                checked={settings.two_factor_required}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, two_factor_required: checked }))}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Minimum Password Length</Label>
              <Input
                type="number"
                min="6"
                max="32"
                value={settings.password_min_length}
                onChange={(e) => setSettings(prev => ({ ...prev, password_min_length: parseInt(e.target.value) || 8 }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Session Timeout (minutes)</Label>
              <Input
                type="number"
                min="5"
                max="480"
                value={settings.session_timeout}
                onChange={(e) => setSettings(prev => ({ ...prev, session_timeout: parseInt(e.target.value) || 30 }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Require Periodic Password Changes</Label>
                <p className="text-sm text-muted-foreground">Force users to change passwords regularly</p>
              </div>
              <Switch
                checked={settings.require_password_change}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, require_password_change: checked }))}
              />
            </div>

            {settings.require_password_change && (
              <div className="space-y-2">
                <Label>Password Change Interval (days)</Label>
                <Input
                  type="number"
                  min="30"
                  max="365"
                  value={settings.password_change_interval}
                  onChange={(e) => setSettings(prev => ({ ...prev, password_change_interval: parseInt(e.target.value) || 90 }))}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Access Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Access Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Max Login Attempts</Label>
              <Input
                type="number"
                min="3"
                max="10"
                value={settings.max_login_attempts}
                onChange={(e) => setSettings(prev => ({ ...prev, max_login_attempts: parseInt(e.target.value) || 5 }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Lockout Duration (minutes)</Label>
              <Input
                type="number"
                min="5"
                max="60"
                value={settings.lockout_duration}
                onChange={(e) => setSettings(prev => ({ ...prev, lockout_duration: parseInt(e.target.value) || 15 }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>IP Whitelist</Label>
                <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
              </div>
              <Switch
                checked={settings.ip_whitelist_enabled}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, ip_whitelist_enabled: checked }))}
              />
            </div>

            {settings.ip_whitelist_enabled && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter IP address (e.g., 192.168.1.1)"
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                  />
                  <Button onClick={addIpToWhitelist} size="sm">
                    Add
                  </Button>
                </div>
                <div className="space-y-1">
                  {settings.allowed_ips.map((ip, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="font-mono text-sm">{ip}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeIpFromWhitelist(ip)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audit & Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Audit & Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Audit Logging</Label>
                <p className="text-sm text-muted-foreground">Log all user actions and system events</p>
              </div>
              <Switch
                checked={settings.audit_logging}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, audit_logging: checked }))}
              />
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Audit logs are automatically retained for 90 days. Critical security events are retained for 1 year.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* API Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Show API Keys</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApiKeys(!showApiKeys)}
              >
                {showApiKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            {showApiKeys && (
              <div className="space-y-2">
                <div className="p-3 bg-muted rounded font-mono text-sm">
                  <div className="flex justify-between items-center">
                    <span>Supabase URL:</span>
                    <span className="text-muted-foreground">••••••••••••••••</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span>Anon Key:</span>
                    <span className="text-muted-foreground">••••••••••••••••</span>
                  </div>
                </div>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    API keys are masked for security. Only super admins can view full keys.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {auditLogs.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No audit logs available</p>
            ) : (
              auditLogs.slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    {getActionIcon(log.action)}
                    <div>
                      <div className="font-medium">{log.action} - {log.resource}</div>
                      <div className="text-sm text-muted-foreground">
                        {log.ip_address} • {formatTimestamp(log.timestamp)}
                      </div>
                    </div>
                  </div>
                  <Badge variant={log.success ? "default" : "destructive"}>
                    {log.success ? "Success" : "Failed"}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Security;
