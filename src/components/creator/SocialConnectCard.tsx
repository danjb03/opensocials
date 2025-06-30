import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { createClient } from "@supabase/supabase-js";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { Loader2, CheckCircle, AlertCircle, Instagram, Youtube, Linkedin, Twitter } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/TikTokIcon';

// Platform configuration
const PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: "instagram", placeholder: "@username or profile URL" },
  { id: "tiktok", name: "TikTok", icon: "tiktok", placeholder: "@username or profile URL" },
  { id: "youtube", name: "YouTube", icon: "youtube", placeholder: "Channel name or URL" },
  { id: "linkedin", name: "LinkedIn", icon: "linkedin", placeholder: "Profile URL or username" },
  { id: "twitter", name: "X.com (Twitter)", icon: "twitter", placeholder: "@username or profile URL" },
];

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper component for platform icons
const PlatformIcon = ({ platform }: { platform: string }) => {
    const iconProps = { className: "w-5 h-5" };
    switch (platform) {
      case 'instagram': return <Instagram {...iconProps} />;
      case 'tiktok': return <TikTokIcon {...iconProps} />;
      case 'youtube': return <Youtube {...iconProps} />;
      case 'linkedin': return <Linkedin {...iconProps} />;
      case 'twitter': return <Twitter {...iconProps} />;
      default: return null;
    }
};

// Helper component for status badges
const StatusBadge = ({ status }: { status: string }) => {
    const statusMap: { [key: string]: { text: string; className: string; icon?: React.ReactNode } } = {
      pending: { text: "Pending", className: "bg-yellow-100 text-yellow-800" },
      running: { text: "Processing", className: "bg-blue-100 text-blue-800", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
      ready: { text: "Connected", className: "bg-green-100 text-green-800", icon: <CheckCircle className="w-3 h-3" /> },
      failed: { text: "Failed", className: "bg-red-100 text-red-800", icon: <AlertCircle className="w-3 h-3" /> },
    };
  
    const currentStatus = statusMap[status] || { text: status, className: "bg-gray-100 text-gray-800" };
  
    return (
      <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 font-medium ${currentStatus.className}`}>
        {currentStatus.icon}
        {currentStatus.text}
      </span>
    );
};

export interface SocialConnectCardProps {
  creatorId?: string; // Optional: if provided, connects account for this creator (admin use)
  onSuccess?: (data: any) => void; // Optional callback for when connection is successful
}

export function SocialConnectCard({ creatorId, onSuccess }: SocialConnectCardProps) {
  const { user } = useUnifiedAuth();
  const { toast } = useToast();
  const [platform, setPlatform] = useState<string>("");
  const [handle, setHandle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("connect");
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([]);

  const targetCreatorId = creatorId || user?.id;

  const fetchConnectedAccounts = useCallback(async () => {
    if (!targetCreatorId) return;
    try {
      const { data, error: fetchError } = await supabase
        .from("creators_social_accounts")
        .select("*")
        .eq("creator_id", targetCreatorId)
        .order("platform", { ascending: true });

      if (fetchError) throw fetchError;
      setConnectedAccounts(data || []);
    } catch (err: any) {
      console.error("Error fetching connected accounts:", err);
      toast({
        title: "Error",
        description: "Failed to load connected accounts.",
        variant: "destructive",
      });
    }
  }, [targetCreatorId, toast]);

  useEffect(() => {
    if (activeTab === "accounts") {
      fetchConnectedAccounts();
    }
  }, [activeTab, fetchConnectedAccounts]);

  const connectSocialAccount = async () => {
    if (!handle.trim() || !platform) {
      setError("Please select a platform and enter a handle or URL.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke("connect-social-account", {
        body: {
          platform,
          handle: handle.trim(),
          creator_id: targetCreatorId,
        },
      });

      if (functionError) throw new Error(functionError.message);
      if (!data.success) throw new Error(data.error || "Failed to connect account.");

      toast({
        title: "Connection Started",
        description: `Your ${platform} account is being processed. Metrics will appear shortly.`,
      });

      setHandle("");
      setPlatform("");
      setActiveTab("accounts");
      fetchConnectedAccounts();
      onSuccess?.(data.data);
    } catch (err: any) {
      console.error("Error connecting social account:", err);
      setError(err.message);
      toast({
        title: "Connection Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedPlatformConfig = PLATFORMS.find(p => p.id === platform);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Social Media Connections</CardTitle>
        <CardDescription>
          Connect your accounts to display analytics and get discovered by brands.
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connect">Connect New Account</TabsTrigger>
          <TabsTrigger value="accounts">My Accounts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="connect">
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={platform}
                onValueChange={(value) => {
                  setPlatform(value);
                  setError(null);
                }}
              >
                <SelectTrigger id="platform" className="w-full">
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      <span className="flex items-center gap-2">
                        <PlatformIcon platform={p.id} />
                        {p.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {platform && (
              <div className="space-y-2">
                <Label htmlFor="handle">Username or Profile URL</Label>
                <Input
                  id="handle"
                  placeholder={selectedPlatformConfig?.placeholder}
                  value={handle}
                  onChange={(e) => {
                    setHandle(e.target.value);
                    setError(null);
                  }}
                  disabled={loading}
                />
              </div>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <p className="text-xs text-muted-foreground pt-2">
              We only access public data. No login or password is required.
            </p>
          </CardContent>
          
          <CardFooter>
            <Button 
              onClick={connectSocialAccount} 
              disabled={loading || !handle.trim() || !platform}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>Connect {selectedPlatformConfig?.name || 'Account'}</>
              )}
            </Button>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="accounts">
          <CardContent className="pt-4">
            {connectedAccounts.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No accounts connected yet.</p>
                <Button 
                  variant="link" 
                  onClick={() => setActiveTab("connect")} 
                  className="mt-2 h-auto p-0"
                >
                  Connect your first account.
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {connectedAccounts.map((account) => (
                  <div 
                    key={account.id} 
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-muted p-2 rounded-full">
                        <PlatformIcon platform={account.platform} />
                      </div>
                      <div>
                        <p className="font-medium">@{account.handle}</p>
                        <p className="text-xs text-muted-foreground capitalize">{account.platform}</p>
                      </div>
                    </div>
                    <StatusBadge status={account.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
