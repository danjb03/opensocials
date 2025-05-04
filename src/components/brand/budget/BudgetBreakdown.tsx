
import React from 'react';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Save } from 'lucide-react';
import { formatCurrency } from '@/utils/project';
import { BudgetLineItem } from './BudgetLineItem';
import { CurrencyType } from './BudgetOverview';

interface BudgetBreakdownProps {
  lineItems: Array<{ id: string; description: string; amount: string }>;
  currency: CurrencyType;
  budget: string;
  onAddLineItem: () => void;
  onChangeLineItem: (index: number, field: 'description' | 'amount', value: string) => void;
  onRemoveLineItem: (index: number) => void;
  onCancel: () => void;
  onSaveBreakdown: () => void;
}

export const BudgetBreakdown: React.FC<BudgetBreakdownProps> = ({
  lineItems,
  currency,
  budget,
  onAddLineItem,
  onChangeLineItem,
  onRemoveLineItem,
  onCancel,
  onSaveBreakdown,
}) => {
  const totalLineItems = lineItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Budget Breakdown</CardTitle>
        <CardDescription>
          Itemize your budget to track where funds are allocated
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="space-y-4">
            {lineItems.map((item, index) => (
              <BudgetLineItem
                key={item.id}
                item={item}
                index={index}
                onChangeItem={onChangeLineItem}
                onRemoveItem={onRemoveLineItem}
                canDelete={lineItems.length > 1}
              />
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={onAddLineItem}
              className="w-full"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Line Item
            </Button>
          </div>
          
          <Card className="bg-gray-50 border border-gray-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Budget:</span>
                <span className="font-medium">
                  {formatCurrency(parseFloat(budget) || 0, currency)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium">Allocated:</span>
                <span className={`font-medium ${totalLineItems > parseFloat(budget) ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(totalLineItems, currency)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium">Remaining:</span>
                <span className={`font-medium ${parseFloat(budget) - totalLineItems < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(parseFloat(budget) - totalLineItems, currency)}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={onCancel}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              type="button"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm"
              onClick={onSaveBreakdown}
            >
              Save Breakdown
              <Save className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
