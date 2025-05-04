
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, DollarSign, Save, PlusCircle, Trash, Check } from 'lucide-react';
import { formatCurrency } from '@/utils/project';

const ManageBudget = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [budget, setBudget] = useState<string>('');
  const [currency, setCurrency] = useState<'USD' | 'GBP' | 'EUR'>('USD');
  const [lineItems, setLineItems] = useState<Array<{id: string, description: string, amount: string}>>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!id) return;
        
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setProject(data);
        setBudget(data.budget ? data.budget.toString() : '');
        setCurrency(data.currency || 'USD');
        
        // Initialize with two empty line items if none exist
        setLineItems([
          { id: 'item-1', description: 'Creator Fee', amount: data.budget ? (data.budget * 0.7).toString() : '0' },
          { id: 'item-2', description: 'Platform Fee', amount: data.budget ? (data.budget * 0.3).toString() : '0' }
        ]);
      } catch (error) {
        console.error('Error fetching project:', error);
        toast({
          title: 'Error',
          description: 'Could not load project details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [id, toast]);

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget(e.target.value);
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value as 'USD' | 'GBP' | 'EUR');
  };

  const handleLineItemChange = (index: number, field: 'description' | 'amount', value: string) => {
    const updatedLineItems = [...lineItems];
    updatedLineItems[index][field] = value;
    setLineItems(updatedLineItems);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { id: `item-${Date.now()}`, description: '', amount: '0' }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      const budgetValue = parseFloat(budget);
      
      if (isNaN(budgetValue)) {
        toast({
          title: 'Invalid Budget',
          description: 'Please enter a valid budget amount',
          variant: 'destructive',
        });
        setSaving(false);
        return;
      }
      
      const { error } = await supabase
        .from('projects')
        .update({
          budget: budgetValue,
          currency: currency
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Budget Updated',
        description: 'Campaign budget has been successfully updated',
        variant: 'default',
      });
      
      navigate(`/brand/projects/${id}`);
    } catch (error) {
      console.error('Error updating budget:', error);
      toast({
        title: 'Error',
        description: 'Could not update budget details',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const totalLineItems = lineItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  if (loading) {
    return (
      <BrandLayout>
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </BrandLayout>
    );
  }

  if (!project) {
    return (
      <BrandLayout>
        <div className="container mx-auto p-6 max-w-7xl">
          <Card>
            <CardContent className="flex flex-col items-center justify-center pt-6 pb-6">
              <h2 className="text-xl font-semibold mb-2">Project not found</h2>
              <p className="text-gray-500 mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
              <Button onClick={() => navigate('/brand/projects')}>
                Back to Projects
              </Button>
            </CardContent>
          </Card>
        </div>
      </BrandLayout>
    );
  }

  return (
    <BrandLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate(`/brand/projects/${id}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaign
            </Button>
            <h1 className="text-3xl font-bold">Manage Budget</h1>
          </div>
        </div>

        <Tabs defaultValue="budget" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="budget">Budget Overview</TabsTrigger>
            <TabsTrigger value="breakdown">Budget Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="budget" className="space-y-6">
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
                      onClick={() => navigate(`/brand/projects/${id}`)}
                      disabled={saving}
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
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-6">
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
                      <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-7">
                          <Input
                            value={item.description}
                            onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                            placeholder="Item description"
                          />
                        </div>
                        <div className="col-span-4">
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input
                              type="number"
                              value={item.amount}
                              onChange={(e) => handleLineItemChange(index, 'amount', e.target.value)}
                              className="pl-10"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        <div className="col-span-1 flex justify-end">
                          {lineItems.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLineItem(index)}
                            >
                              <Trash className="h-4 w-4 text-gray-500" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addLineItem}
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
                          {formatCurrency(project.budget, project.currency)}
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
                      onClick={() => navigate(`/brand/projects/${id}`)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="button"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm"
                      onClick={() => {
                        toast({
                          title: 'Feature Coming Soon',
                          description: 'Budget breakdown saving will be available soon.',
                        });
                      }}
                    >
                      Save Breakdown
                      <Save className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </BrandLayout>
  );
};

export default ManageBudget;
