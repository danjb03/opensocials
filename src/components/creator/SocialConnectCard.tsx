
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { createClient } from "@supabase/supabase-js";

// Platform configuration
const PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: "instagram", placeholder: "@username or profile URL" },
  { id: "tiktok", name: "TikTok", icon: "tiktok", placeholder: "@username or profile URL" },
  { id: "youtube", name: "YouTube", icon: "youtube", placeholder: "Channel name or URL" },
  { id: "linkedin", name: "LinkedIn", icon: "linkedin", placeholder: "Profile URL or username" },
];

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SocialConnectCardProps {
  creatorId?: string; // Optional: if provided, connects account for this creator (admin use)
  onSuccess?: (data: any) => void; // Optional callback for when connection is successful
}

export function SocialConnectCard({ creatorId, onSuccess }: SocialConnectCardProps) {
  const { toast } = useToast();
  const [platform, setPlatform] = useState<string>("instagram");
  const [handle, setHandle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("connect");
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([]);

  // Fetch connected accounts on component mount
  const fetchConnectedAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from("creators_social_accounts")
        .select("*")
        .order("platform", { ascending: true });

      if (error) throw error;
      setConnectedAccounts(data || []);
    } catch (err) {
      console.error("Error fetching connected accounts:", err);
      toast({
        title: "Error",
        description: "Failed to load connected accounts",
        variant: "destructive",
      });
    }
  };

  // Connect social account
  const connectSocialAccount = async () => {
    if (!handle.trim()) {
      setError("Please enter a username or URL");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke("connect-social-account", {
        body: {
          platform,
          handle: handle.trim(),
          creator_id: creatorId, // Will be undefined for self-connection
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || "Failed to connect account");
      }

      // Success!
      toast({
        title: "Account Connected",
        description: `Your ${PLATFORMS.find(p => p.id === platform)?.name} account is being connected. Data will appear shortly.`,
      });

      // Clear form
      setHandle("");
      
      // Refresh connected accounts
      fetchConnectedAccounts();
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(data.data);
      }
      
      // Switch to accounts tab
      setActiveTab("accounts");
    } catch (err) {
      console.error("Error connecting social account:", err);
      setError(err.message || "Failed to connect account");
      toast({
        title: "Connection Failed",
        description: err.message || "Failed to connect account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Platform icon component
  const PlatformIcon = ({ platform }: { platform: string }) => {
    const iconMap = {
      instagram: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      tiktok: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
      youtube: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      linkedin: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    };

    return iconMap[platform] || null;
  };

  // Account status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusMap = {
      pending: <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>,
      running: <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center gap-1">
        <div className="w-3 h-3 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin" />
        Processing
      </span>,
      ready: <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Connected</span>,
      failed: <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Failed</span>,
    };

    return statusMap[status] || <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Social Media Accounts</CardTitle>
        <CardDescription>
          Connect your social media accounts to display analytics and metrics
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connect">Connect Account</TabsTrigger>
          <TabsTrigger value="accounts" onClick={fetchConnectedAccounts}>My Accounts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="connect">
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="platform" className="text-sm font-medium">
                Platform
              </label>
              <Select
                value={platform}
                onValueChange={(value) => {
                  setPlatform(value);
                  setError(null);
                }}
              >
                <SelectTrigger id="platform" className="w-full">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="flex items-center gap-2">
                      <span className="flex items-center gap-2">
                        <PlatformIcon platform={p.id} />
                        {p.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="handle" className="text-sm font-medium">
                Username or URL
              </label>
              <Input
                id="handle"
                placeholder={PLATFORMS.find(p => p.id === platform)?.placeholder}
                value={handle}
                onChange={(e) => {
                  setHandle(e.target.value);
                  setError(null);
                }}
                disabled={loading}
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="text-sm text-gray-500">
              <p>We'll collect publicly available data from your profile.</p>
              <p>No login required - just enter your handle or profile URL.</p>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              onClick={connectSocialAccount} 
              disabled={loading || !handle.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                  Connecting...
                </>
              ) : (
                <>Connect {PLATFORMS.find(p => p.id === platform)?.name}</>
              )}
            </Button>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="accounts">
          <CardContent className="pt-4">
            {connectedAccounts.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">No connected accounts yet</p>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("connect")} 
                  className="mt-2"
                >
                  Connect your first account
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
                      <div className="bg-gray-100 p-2 rounded-full">
                        <PlatformIcon platform={account.platform} />
                      </div>
                      <div>
                        <p className="font-medium">@{account.handle}</p>
                        <StatusBadge status={account.status} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {account.status === "failed" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setPlatform(account.platform);
                            setHandle(account.handle);
                            setActiveTab("connect");
                          }}
                        >
                          Retry
                        </Button>
                      )}
                    </div>
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
