
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash, DollarSign } from 'lucide-react';

interface BudgetLineItemProps {
  item: { id: string; description: string; amount: string };
  index: number;
  onChangeItem: (index: number, field: 'description' | 'amount', value: string) => void;
  onRemoveItem: (index: number) => void;
  canDelete: boolean;
}

export const BudgetLineItem: React.FC<BudgetLineItemProps> = ({
  item,
  index,
  onChangeItem,
  onRemoveItem,
  canDelete,
}) => {
  return (
    <div className="grid grid-cols-12 gap-4 items-center">
      <div className="col-span-7">
        <Input
          value={item.description}
          onChange={(e) => onChangeItem(index, 'description', e.target.value)}
          placeholder="Item description"
        />
      </div>
      <div className="col-span-4">
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            type="number"
            value={item.amount}
            onChange={(e) => onChangeItem(index, 'amount', e.target.value)}
            className="pl-10"
            placeholder="0.00"
          />
        </div>
      </div>
      <div className="col-span-1 flex justify-end">
        {canDelete && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemoveItem(index)}
          >
            <Trash className="h-4 w-4 text-gray-500" />
          </Button>
        )}
      </div>
    </div>
  );
};
