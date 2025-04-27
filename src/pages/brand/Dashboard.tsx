
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/lib/auth';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, ArrowLeft } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<string>("all");
  const [audience, setAudience] = useState<string>("all");
  const [contentType, setContentType] = useState<string>("all");
  
  const handleNewProject = () => {
    const queryParams = new URLSearchParams();
    if (platform && platform !== 'all') queryParams.append('platform', platform);
    if (audience && audience !== 'all') queryParams.append('audience', audience);
    if (contentType && contentType !== 'all') queryParams.append('contentType', contentType);
    
    navigate(`/brand/creators?${queryParams.toString()}`);
  };

  const handleBackToSuperAdmin = () => {
    navigate('/super-admin');
  };

  return (
    <BrandLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Brand Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={handleBackToSuperAdmin} 
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Super Admin
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <Card className="col-span-full bg-white">
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>Here's what you can do today</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Start a new project to find creators that match your brand's needs,
                or check on your existing orders.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Sheet>
                <SheetTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Project
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Create a New Project</SheetTitle>
                    <SheetDescription>
                      Filter creators to find the perfect match for your campaign.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="platform">Platform</label>
                      <Select value={platform} onValueChange={setPlatform}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Platforms</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <label htmlFor="audience">Target Audience</label>
                      <Select value={audience} onValueChange={setAudience}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Audiences</SelectItem>
                          <SelectItem value="gen-z">Gen Z</SelectItem>
                          <SelectItem value="millennials">Millennials</SelectItem>
                          <SelectItem value="gen-x">Gen X</SelectItem>
                          <SelectItem value="boomers">Boomers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <label htmlFor="contentType">Content Type</label>
                      <Select value={contentType} onValueChange={setContentType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Content</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="photo">Photo</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="blog">Blog</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button onClick={handleNewProject}>Search Creators</Button>
                  </div>
                </SheetContent>
              </Sheet>
              <Button variant="outline" onClick={() => navigate('/brand/orders')}>
                View Orders
              </Button>
            </CardFooter>
          </Card>

          {/* Stats cards - can be expanded later */}
          <Card>
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">3</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Creator Collaborations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">12</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Completed Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">8</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </BrandLayout>
  );
};

export default Dashboard;
