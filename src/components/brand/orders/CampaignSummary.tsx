
import React, { useState, useEffect } from 'react';
import { Order } from '@/types/orders';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SummaryHeader from './campaign-summary/SummaryHeader';
import CampaignDetailForm from './campaign-summary/CampaignDetailForm';
import CampaignDetailView from './campaign-summary/CampaignDetailView';

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
      <SummaryHeader 
        isEditing={isEditing}
        isSaving={isSaving}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      
      {isEditing ? (
        <CampaignDetailForm 
          updatedData={updatedData}
          handleChange={handleChange}
          handlePlatformToggle={handlePlatformToggle}
        />
      ) : (
        <CampaignDetailView order={order} />
      )}
    </div>
  );
};

export default CampaignSummary;
