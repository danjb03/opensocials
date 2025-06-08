
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SuccessAnimation } from "@/components/ui/success-animation";
import { CampaignNameField } from './project-form/CampaignNameField';
import { ExecutionDateField } from './project-form/ExecutionDateField';
import { BudgetFields } from './project-form/BudgetFields';
import { DescriptionField } from './project-form/DescriptionField';
import { SubmitButton } from './project-form/SubmitButton';
import { useProjectForm2 } from '@/hooks/useProjectForm2';

type ProjectFormProps = {
  onSuccess?: (project: z.infer<typeof formSchema>) => void;
};

// Define schema here to be consistent with the old component
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Campaign name must be at least 2 characters.",
  }),
  executionDate: z.date({
    required_error: "Please select an execution date.",
  }),
  budget: z.string().min(1, {
    message: "Please enter a budget amount.",
  }),
  currency: z.enum(['USD', 'EUR', 'GBP', 'JPY', 'CHF'], {
    required_error: "Please select a currency.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

export function ProjectForm({ onSuccess }: ProjectFormProps) {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { 
    form, 
    currencies, 
    isSubmitting, 
    onSubmit: originalOnSubmit, 
    calculateDaysRemaining
  } = useProjectForm2((values) => {
    setShowSuccess(true);
  });

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    if (onSuccess) {
      onSuccess(form.getValues());
    } else {
      navigate('/brand/projects');
    }
  };

  const isFormValid = form.formState.isValid;

  return (
    <>
      <Card className="w-full shadow-md">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-xl">Create New Campaign</CardTitle>
          <CardDescription>Fill in the details for your new marketing campaign.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(originalOnSubmit)} className="space-y-6">
              <CampaignNameField />
              <ExecutionDateField calculateDaysRemaining={calculateDaysRemaining} />
              <BudgetFields currencies={currencies} />
              <DescriptionField />
              <SubmitButton isSubmitting={isSubmitting} isValid={isFormValid} />
            </form>
          </Form>
        </CardContent>
      </Card>

      <SuccessAnimation
        show={showSuccess}
        message="Campaign Created Successfully!"
        onComplete={handleSuccessComplete}
        duration={2500}
      />
    </>
  );
}
