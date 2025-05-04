
import React from 'react';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Check } from 'lucide-react';
import { formatCurrency } from '@/utils/project';

// Define the currency type for TypeScript type checking
export type CurrencyType = 'USD' | 'GBP' | 'EUR';

interface BudgetOverviewProps {
  budget: string;
  currency: CurrencyType;
  handleBudgetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCurrencyChange: (value: CurrencyType) => void;
  handleSubmit: (e: React.FormEvent) => void;
  project: any;
  saving: boolean;
  onCancel: () => void;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({
  budget,
  currency,
  handleBudgetChange,
  handleCurrencyChange,
  handleSubmit,
  project,
  saving,
  onCancel,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Campaign Budget</CardTitle>
        <CardDescription>
          Set the total budget for this campaign
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="budget">Total Budget</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  value={budget}
                  onChange={handleBudgetChange}
                  className="pl-10"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select 
                value={currency}
                onValueChange={handleCurrencyChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Card className="bg-gray-50 border border-gray-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Current budget:</span>
                <span className="font-medium">
                  {formatCurrency(project.budget, project.currency)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium">New budget:</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(parseFloat(budget) || 0, currency)}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={onCancel}
              disabled={saving}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm"
            >
              {saving ? 'Saving...' : 'Update Budget'}
              {!saving && <Check className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
