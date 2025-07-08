import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Edit2, Trash2, Save, X, DollarSign, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';

interface PricingFloor {
  id: string;
  tier: string;
  campaign_type: string;
  min_price: number;
  max_price: number;
  currency: string;
  status: 'active' | 'inactive';
}

const PricingFloors = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<PricingFloor | null>(null);
  const [newFloor, setNewFloor] = useState<Omit<PricingFloor, 'id'>>({
    tier: 'bronze',
    campaign_type: 'single',
    min_price: 0,
    max_price: 0,
    currency: 'USD',
    status: 'active',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUnifiedAuth();
  const queryClient = useQueryClient();

  const { data: pricingFloors, isLoading, error } = useQuery<PricingFloor[]>(
    'pricingFloors',
    async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('pricing_floors')
        .select('*')
        .order('tier', { ascending: true });

      if (error) {
        console.error('Error fetching pricing floors:', error);
        throw new Error('Failed to fetch pricing floors');
      }
      return data || [];
    }
  );

  useEffect(() => {
    queryClient.invalidateQueries('pricingFloors');
  }, [queryClient]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    setSelectedFloor(null);
    setNewFloor({
      tier: 'bronze',
      campaign_type: 'single',
      min_price: 0,
      max_price: 0,
      currency: 'USD',
      status: 'active',
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedFloor(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewFloor(prev => ({ ...prev, [name]: value }));
  };

  const handleEditFloor = (floor: PricingFloor) => {
    setIsEditing(true);
    setSelectedFloor(floor);
    setNewFloor({
      tier: floor.tier,
      campaign_type: floor.campaign_type,
      min_price: floor.min_price,
      max_price: floor.max_price,
      currency: floor.currency,
      status: floor.status,
    });
    setIsModalOpen(true);
  };

  const handleSaveFloor = async () => {
    if (!user?.id) return;

    try {
      if (isEditing && selectedFloor) {
        // Update existing floor
        const { error } = await supabase
          .from('pricing_floors')
          .update(newFloor)
          .eq('id', selectedFloor.id);

        if (error) {
          console.error('Error updating pricing floor:', error);
          throw new Error('Failed to update pricing floor');
        }
      } else {
        // Create new floor
        const { error } = await supabase
          .from('pricing_floors')
          .insert([{ ...newFloor }]);

        if (error) {
          console.error('Error creating pricing floor:', error);
          throw new Error('Failed to create pricing floor');
        }
      }

      // Invalidate query to refetch data
      await queryClient.invalidateQueries('pricingFloors');
      handleCloseModal();
    } catch (err) {
      console.error('Error saving pricing floor:', err);
    }
  };

  const handleDeleteFloor = async (floorId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('pricing_floors')
        .delete()
        .eq('id', floorId);

      if (error) {
        console.error('Error deleting pricing floor:', error);
        throw new Error('Failed to delete pricing floor');
      }

      // Invalidate query to refetch data
      await queryClient.invalidateQueries('pricingFloors');
    } catch (err) {
      console.error('Error deleting pricing floor:', err);
    }
  };

  const filteredPricingFloors = pricingFloors
    ? pricingFloors.filter(floor =>
        floor.tier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        floor.campaign_type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  if (isLoading) {
    return <div>Loading pricing floors...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Pricing Floors
            <Button onClick={handleOpenModal}>
              <Plus className="mr-2 h-4 w-4" />
              Add Pricing Floor
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Search by tier or campaign type..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="mb-4"
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tier</TableHead>
                <TableHead>Campaign Type</TableHead>
                <TableHead>Min Price</TableHead>
                <TableHead>Max Price</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPricingFloors.map(floor => (
                <TableRow key={floor.id}>
                  <TableCell>{floor.tier}</TableCell>
                  <TableCell>{floor.campaign_type}</TableCell>
                  <TableCell>{floor.min_price}</TableCell>
                  <TableCell>{floor.max_price}</TableCell>
                  <TableCell>{floor.currency}</TableCell>
                  <TableCell>
                    <Badge variant={floor.status === 'active' ? 'outline' : 'secondary'}>
                      {floor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditFloor(floor)}
                    >
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFloor(floor.id)}
                      className="text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50">
          <div className="relative m-auto mt-20 max-w-md rounded-lg bg-white p-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isEditing ? 'Edit Pricing Floor' : 'Add Pricing Floor'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tier" className="text-right">
                      Tier
                    </Label>
                    <Select
                      id="tier"
                      name="tier"
                      value={newFloor.tier}
                      onValueChange={(value) => setNewFloor(prev => ({ ...prev, tier: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bronze">Bronze</SelectItem>
                        <SelectItem value="silver">Silver</SelectItem>
                        <SelectItem value="gold">Gold</SelectItem>
                        <SelectItem value="platinum">Platinum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="campaign_type" className="text-right">
                      Campaign Type
                    </Label>
                    <Select
                      id="campaign_type"
                      name="campaign_type"
                      value={newFloor.campaign_type}
                      onValueChange={(value) => setNewFloor(prev => ({ ...prev, campaign_type: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a campaign type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="12-month retainer">12-Month Retainer</SelectItem>
                        <SelectItem value="evergreen">Evergreen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="min_price" className="text-right">
                      Min Price
                    </Label>
                    <Input
                      type="number"
                      id="min_price"
                      name="min_price"
                      value={String(newFloor.min_price)}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="max_price" className="text-right">
                      Max Price
                    </Label>
                    <Input
                      type="number"
                      id="max_price"
                      name="max_price"
                      value={String(newFloor.max_price)}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="currency" className="text-right">
                      Currency
                    </Label>
                    <Select
                      id="currency"
                      name="currency"
                      value={newFloor.currency}
                      onValueChange={(value) => setNewFloor(prev => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select
                      id="status"
                      name="status"
                      value={newFloor.status}
                      onValueChange={(value) => setNewFloor(prev => ({ ...prev, status: value as 'active' | 'inactive' }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveFloor}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingFloors;
