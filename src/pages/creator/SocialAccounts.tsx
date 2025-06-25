import { useState } from "react";
import { SocialConnectCard } from "@/components/creator/SocialConnectCard";
import { SocialMetricsCards } from "@/components/creator/SocialMetricsCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function SocialAccounts() {
  const { toast } = useToast();
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("metrics");

  // Callback for when a new account is connected
  const handleAccountConnected = (data: any) => {
    toast({
      title: "Account Connected",
      description: `Your ${data.platform} account is being connected. Data will appear shortly.`,
    });
    
    // Trigger a refresh of metrics after a delay to allow processing
    setTimeout(() => {
      setRefreshTrigger(prev => prev + 1);
      setActiveTab("metrics");
    }, 5000);
  };

  // Callback for when metrics are refreshed
  const handleMetricsRefresh = () => {
    // Trigger a refresh after a delay to allow processing
    setTimeout(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 5000);
  };

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Social Accounts</h1>
        <p className="text-muted-foreground">
          Connect and manage your social media accounts to showcase your metrics and analytics.
        </p>
      </div>
      
      <Separator />
      
      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="metrics">Analytics</TabsTrigger>
          <TabsTrigger value="connect">Connect Accounts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics" className="space-y-6">
          {/* Metrics Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media Metrics</CardTitle>
              <CardDescription>
                View your performance metrics across all connected platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Key that forces re-render when refreshTrigger changes */}
              <SocialMetricsCards 
                key={`metrics-${refreshTrigger}`} 
                onRefresh={handleMetricsRefresh} 
              />
            </CardContent>
          </Card>
          
          {/* Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle>Improve Your Metrics</CardTitle>
              <CardDescription>
                Tips to boost your social media performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Post consistently to maintain audience engagement</li>
                <li>Respond to comments to increase your engagement rate</li>
                <li>Use trending hashtags relevant to your content</li>
                <li>Analyze your best performing posts and create similar content</li>
                <li>Cross-promote your accounts across different platforms</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="connect">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Connect Account Card */}
            <div>
              <SocialConnectCard onSuccess={handleAccountConnected} />
            </div>
            
            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Why Connect Your Accounts?</CardTitle>
                <CardDescription>
                  Benefits of connecting your social media profiles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Enhanced Profile</h3>
                  <p className="text-sm text-gray-600">
                    Showcase your social reach to potential brand partners
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Unified Analytics</h3>
                  <p className="text-sm text-gray-600">
                    Track performance across all platforms in one dashboard
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Better Opportunities</h3>
                  <p className="text-sm text-gray-600">
                    Get matched with brands looking for your audience demographics
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Growth Insights</h3>
                  <p className="text-sm text-gray-600">
                    Identify which platforms are growing fastest and need more attention
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
