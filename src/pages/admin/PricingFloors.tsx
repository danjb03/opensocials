
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchInput } from '@/components/ui/search-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PricingFloorsTable } from '@/components/admin/pricing/PricingFloorsTable';
import { CreatePricingFloorModal } from '@/components/admin/pricing/CreatePricingFloorModal';
import { usePricingFloors } from '@/hooks/admin/usePricingFloors';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import AdminCRMLayout from '@/components/layouts/AdminCRMLayout';

const CREATOR_TIERS = ['Nano', 'Micro', 'Mid', 'Macro', 'Large', 'Celebrity'];
const CAMPAIGN_TYPES = ['Single', 'Weekly', 'Monthly', '12-Month Retainer', 'Evergreen'];

export default function PricingFloors() {
  const { role } = useUnifiedAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [campaignTypeFilter, setCampaignTypeFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: pricingFloors, isLoading, error } = usePricingFloors();

  // Check admin access
  if (role !== 'admin' && role !== 'super_admin') {
    return (
      <AdminCRMLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
        </div>
      </AdminCRMLayout>
    );
  }

  // Filter pricing floors based on search and filters
  const filteredPricingFloors = pricingFloors?.filter((floor) => {
    const matchesSearch = 
      floor.tier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      floor.campaign_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTier = tierFilter === 'all' || floor.tier === tierFilter;
    const matchesCampaignType = campaignTypeFilter === 'all' || floor.campaign_type === campaignTypeFilter;

    return matchesSearch && matchesTier && matchesCampaignType;
  }) || [];

  if (error) {
    return (
      <AdminCRMLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">Error loading pricing floors. Please try again.</p>
        </div>
      </AdminCRMLayout>
    );
  }

  return (
    <AdminCRMLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pricing Floors</h1>
            <p className="text-muted-foreground">
              Total Pricing Floors: {pricingFloors?.length || 0} | Manage minimum pricing for different creator tiers and campaign types
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Pricing Floor
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pricing Configuration</CardTitle>
            <CardDescription>
              Set minimum pricing floors for creator tiers across different campaign types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <SearchInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search by tier or campaign type..."
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={tierFilter} onValueChange={setTierFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      {CREATOR_TIERS.map((tier) => (
                        <SelectItem key={tier} value={tier}>
                          {tier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={campaignTypeFilter} onValueChange={setCampaignTypeFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by campaign type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Campaign Types</SelectItem>
                      {CAMPAIGN_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <PricingFloorsTable 
              pricingFloors={filteredPricingFloors} 
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        <CreatePricingFloorModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </AdminCRMLayout>
  );
}
