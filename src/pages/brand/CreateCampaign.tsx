
import React from 'react';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateCampaign = () => {
  const navigate = useNavigate();

  return (
    <BrandLayout>
      <div className="container mx-auto p-6 bg-background">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/brand/dashboard')}
            className="mb-4 text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-light text-foreground mb-2">Create Campaign</h1>
          <p className="text-muted-foreground">Set up a new creator campaign</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Plus className="h-5 w-5" />
              Campaign Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input id="name" placeholder="Enter campaign name" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe your campaign objectives and requirements"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input id="budget" type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" type="date" />
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="bg-primary text-primary-foreground">
                Create Campaign
              </Button>
              <Button variant="outline" onClick={() => navigate('/brand/dashboard')}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </BrandLayout>
  );
};

export default CreateCampaign;
