
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CurrencyType } from '@/components/brand/budget/BudgetOverview';

export const useBudgetManager = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [budget, setBudget] = useState<string>('');
  const [currency, setCurrency] = useState<CurrencyType>('USD');
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
        setCurrency((data.currency || 'USD') as CurrencyType);
        
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

  const handleCurrencyChange = (value: CurrencyType) => {
    setCurrency(value);
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

  const handleSaveBreakdown = () => {
    toast({
      title: 'Feature Coming Soon',
      description: 'Budget breakdown saving will be available soon.',
    });
  };

  return {
    project,
    loading,
    saving,
    budget,
    currency,
    lineItems,
    handleBudgetChange,
    handleCurrencyChange,
    handleLineItemChange,
    addLineItem,
    removeLineItem,
    handleSubmit,
    handleSaveBreakdown,
    navigate,
  };
};
