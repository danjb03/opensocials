
import React, { useState } from 'react';
import { Order } from '@/types/orders';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CampaignSummaryProps {
  order: Order;
  onUpdateOrder?: (updatedOrder: Order) => void;
}

const CampaignSummary: React.FC<CampaignSummaryProps> = ({ 
  order,
  onUpdateOrder
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    title: order.title,
    description: order.description || '',
    budget: order.budget.toString(),
    platform: order.platform || 'instagram'
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setUpdatedData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Update in database
      const { error } = await supabase
        .from('projects')
        .update({
          name: updatedData.title,
          description: updatedData.description,
          budget: parseFloat(updatedData.budget),
          platforms: updatedData.platform ? [updatedData.platform] : []
        })
        .eq('id', order.id);
      
      if (error) throw error;
      
      // Update local state
      if (onUpdateOrder) {
        onUpdateOrder({
          ...order,
          title: updatedData.title,
          description: updatedData.description,
          budget: parseFloat(updatedData.budget),
          platform: updatedData.platform
        });
      }
      
      toast({
        title: "Campaign updated",
        description: "The campaign details have been saved."
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast({
        title: "Update failed",
        description: "Could not update campaign details.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    setUpdatedData({
      title: order.title,
      description: order.description || '',
      budget: order.budget.toString(),
      platform: order.platform || 'instagram'
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-900">Campaign Details</h3>
        
        {isEditing ? (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCancel}
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-4 w-4 mr-1" />
            Edit Details
          </Button>
        )}
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Campaign Name</label>
                <Input
                  name="title"
                  value={updatedData.title}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                <Textarea
                  name="description"
                  value={updatedData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Budget</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      $
                    </span>
                    <Input
                      name="budget"
                      type="number"
                      value={updatedData.budget}
                      onChange={handleChange}
                      className="pl-7"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Platform</label>
                  <Select 
                    value={updatedData.platform} 
                    onValueChange={(value) => handleSelectChange('platform', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{order.title}</h3>
                <p className="text-gray-500 mt-1">{order.description || 'No description provided'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-medium">${order.budget.toLocaleString()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Platform</p>
                  <Badge className="mt-1 capitalize">{order.platform || 'Not specified'}</Badge>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 border-blue-200">
                  {order.stage.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignSummary;
