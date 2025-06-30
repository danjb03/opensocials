import { useState, useCallback } from "react";
import { SocialPlatformConnectApify } from "@/components/creator/SocialPlatformConnectApify";
import { SocialMetricsCards } from "@/components/creator/SocialMetricsCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { HelpCircle } from "lucide-react";

export default function SocialAccounts() {
  const { user } = useUnifiedAuth();
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("metrics");

  // This callback will be triggered to force a re-fetch of the metrics data.
  const handleDataUpdate = useCallback(() => {
    // Incrementing the key forces the SocialMetricsCards component to remount and fetch fresh data.
    // A small delay gives the backend time to process the new data.
    setTimeout(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 5000); // 5-second delay
  }, []);

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
                View your performance metrics across all connected platforms. Data is refreshed weekly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user && (
                <SocialMetricsCards 
                  key={`metrics-${refreshTrigger}`} 
                  creatorId={user.id} 
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="connect">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Connect Account Card */}
            <div>
              <SocialPlatformConnectApify onSuccess={handleDataUpdate} />
            </div>
            
            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Why Connect Your Accounts?
                </CardTitle>
                <CardDescription>
                  Benefits of connecting your social media profiles.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Enhanced Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    Showcase your social reach to potential brand partners with verified, up-to-date metrics.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Unified Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Track performance across all platforms in one convenient dashboard.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Better Opportunities</h3>
                  <p className="text-sm text-muted-foreground">
                    Get matched with brands looking for creators with your specific audience demographics and engagement rates.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Growth Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Identify which platforms are growing fastest and where you should focus your creative energy.
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
