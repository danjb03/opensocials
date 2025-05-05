
import React, { useState, useEffect } from 'react';
import { Order } from '@/types/orders';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Save, X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { platformOptions } from '@/components/brand/filters/PlatformFilter';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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
    platforms: order.platformsList || []
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  // Update local state when order changes
  useEffect(() => {
    setUpdatedData({
      title: order.title,
      description: order.description || '',
      budget: order.budget.toString(),
      platforms: order.platformsList || []
    });
  }, [order]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlatformToggle = (platform: string) => {
    setUpdatedData(prev => {
      const newPlatforms = prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform];
      
      return { ...prev, platforms: newPlatforms };
    });
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
          platforms: updatedData.platforms
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
          platformsList: updatedData.platforms,
          platform: updatedData.platforms.length > 0 ? updatedData.platforms[0].toLowerCase() : undefined
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
      platforms: order.platformsList || []
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-xl text-gray-900">Campaign Details</h3>
        
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
              className="bg-black hover:bg-gray-800"
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
            className="border border-gray-300 hover:bg-gray-50"
          >
            <Edit2 className="h-4 w-4 mr-1" />
            Edit Details
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">Campaign Name</label>
            <Input
              name="title"
              value={updatedData.title}
              onChange={handleChange}
              className="border-gray-200 focus-visible:ring-black"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">Description</label>
            <Textarea
              name="description"
              value={updatedData.description}
              onChange={handleChange}
              rows={3}
              className="border-gray-200 focus-visible:ring-black"
              placeholder="Add campaign description..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">Budget</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                $
              </span>
              <Input
                name="budget"
                type="number"
                value={updatedData.budget}
                onChange={handleChange}
                className="pl-7 border-gray-200 focus-visible:ring-black"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">Platforms</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {platformOptions.map((platform) => (
                <div key={platform} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50">
                  <Checkbox 
                    id={`platform-${platform}`}
                    checked={updatedData.platforms.includes(platform)}
                    onCheckedChange={() => handlePlatformToggle(platform)}
                  />
                  <Label 
                    htmlFor={`platform-${platform}`}
                    className="cursor-pointer flex-grow"
                  >
                    {platform}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 space-y-5">
            <div className="pb-4">
              <h2 className="text-2xl font-semibold text-gray-900">{order.title}</h2>
              <p className="text-gray-600 mt-2">
                {order.description || 'No description provided'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Budget</p>
                <p className="font-semibold text-lg">${order.budget.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Platforms</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {order.platformsList && order.platformsList.length > 0 ? (
                    order.platformsList.map((platform) => (
                      <Badge 
                        key={platform}
                        className="capitalize text-sm px-3 py-1 font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                      >
                        {platform}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-500">No platforms specified</span>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200 capitalize">
                {order.stage.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignSummary;
