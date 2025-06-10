
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BudgetOverview } from '@/components/brand/budget/BudgetOverview';
import { BudgetBreakdown } from '@/components/brand/budget/BudgetBreakdown';
import { useBudgetManager } from '@/hooks/useBudgetManager';

const ManageBudget = () => {
  const {
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
  } = useBudgetManager();

  if (loading) {
    return (
      <BrandLayout>
        <div className="container mx-auto p-6 max-w-7xl bg-background">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </BrandLayout>
    );
  }

  if (!project) {
    return (
      <BrandLayout>
        <div className="container mx-auto p-6 max-w-7xl bg-background">
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center pt-6 pb-6">
              <h2 className="text-xl font-semibold mb-2 text-foreground">Project not found</h2>
              <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
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
      <div className="container mx-auto p-6 max-w-7xl bg-background">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate(`/brand/projects/${project.id}`)} className="border-border text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaign
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Manage Budget</h1>
          </div>
        </div>

        <Tabs defaultValue="budget" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-[400px] bg-card border-border">
            <TabsTrigger value="budget" className="text-foreground data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Budget Overview</TabsTrigger>
            <TabsTrigger value="breakdown" className="text-foreground data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Budget Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="budget" className="space-y-6">
            <BudgetOverview
              budget={budget}
              currency={currency}
              handleBudgetChange={handleBudgetChange}
              handleCurrencyChange={handleCurrencyChange}
              handleSubmit={handleSubmit}
              project={project}
              saving={saving}
              onCancel={() => navigate(`/brand/projects/${project.id}`)}
            />
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-6">
            <BudgetBreakdown
              lineItems={lineItems}
              currency={currency}
              budget={budget}
              onAddLineItem={addLineItem}
              onChangeLineItem={handleLineItemChange}
              onRemoveLineItem={removeLineItem}
              onCancel={() => navigate(`/brand/projects/${project.id}`)}
              onSaveBreakdown={handleSaveBreakdown}
            />
          </TabsContent>
        </Tabs>
      </div>
    </BrandLayout>
  );
};

export default ManageBudget;
