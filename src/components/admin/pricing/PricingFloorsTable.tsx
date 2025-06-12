
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useUpdatePricingFloor, useDeletePricingFloor, type PricingFloor } from '@/hooks/admin/usePricingFloors';
import { Skeleton } from '@/components/ui/skeleton';

interface PricingFloorsTableProps {
  pricingFloors: PricingFloor[];
  isLoading: boolean;
}

export const PricingFloorsTable: React.FC<PricingFloorsTableProps> = ({
  pricingFloors,
  isLoading
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const updateMutation = useUpdatePricingFloor();
  const deleteMutation = useDeletePricingFloor();

  const handleEdit = (floor: PricingFloor) => {
    setEditingId(floor.id);
    setEditValue(floor.min_price.toString());
  };

  const handleSave = async () => {
    if (!editingId) return;
    
    const numericValue = parseFloat(editValue);
    if (isNaN(numericValue) || numericValue < 0) {
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: editingId,
        min_price: numericValue
      });
      setEditingId(null);
      setEditValue('');
    } catch (error) {
      console.error('Failed to update pricing floor:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete pricing floor:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Creator Tier</TableHead>
            <TableHead>Campaign Type</TableHead>
            <TableHead>Minimum Price</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pricingFloors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No pricing floors found
              </TableCell>
            </TableRow>
          ) : (
            pricingFloors.map((floor) => (
              <TableRow key={floor.id}>
                <TableCell>
                  <Badge variant="outline">{floor.tier}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{floor.campaign_type}</Badge>
                </TableCell>
                <TableCell>
                  {editingId === floor.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">£</span>
                      <Input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24"
                        min="0"
                        step="1"
                      />
                    </div>
                  ) : (
                    <span className="font-medium">{formatCurrency(floor.min_price)}</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(floor.updated_at), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {editingId === floor.id ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleSave}
                          disabled={updateMutation.isPending}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(floor)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Pricing Floor</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this pricing floor for {floor.tier} tier {floor.campaign_type} campaigns?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(floor.id)}
                                disabled={deleteMutation.isPending}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
