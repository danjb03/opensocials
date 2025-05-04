
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock } from 'lucide-react';
import { FileText, Users, Flag, Calendar, Globe, BarChart2 } from 'lucide-react';

// Define campaign step icons mapping
const StepIcons = {
  FileText,
  Users,
  Flag,
  Calendar,
  Globe,
  BarChart2
};

interface CampaignStep {
  id: string;
  label: string;
  icon: keyof typeof StepIcons;
}

interface CampaignProgressProps {
  currentStep: number;
  campaignSteps: CampaignStep[];
}

export const CampaignProgress: React.FC<CampaignProgressProps> = ({
  currentStep,
  campaignSteps,
}) => {
  const progressPercentage = (currentStep / campaignSteps.length) * 100;

  return (
    <Card className="mb-8 overflow-hidden shadow-sm">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-xl">Campaign Progress</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4 border rounded-lg p-4 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
          {campaignSteps.map((step, index) => {
            const isCompleted = index + 1 < currentStep;
            const isCurrent = index + 1 === currentStep;
            const StepIcon = StepIcons[step.icon];
            
            return (
              <div key={step.id} className={`flex flex-col items-center p-3 rounded-lg border ${
                isCompleted ? 'bg-green-50 border-green-200' : 
                isCurrent ? 'bg-blue-50 border-blue-200' : 
                'bg-gray-50 border-gray-200'
              } shadow-sm`}>
                <div className={`rounded-full p-2 mb-2 ${
                  isCompleted ? 'bg-green-100 text-green-600' : 
                  isCurrent ? 'bg-blue-100 text-blue-600' : 
                  'bg-gray-100 text-gray-400'
                }`}>
                  <StepIcon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-center">{step.label}</span>
                {isCompleted && <CheckCircle className="text-green-500 h-4 w-4 mt-1" />}
                {isCurrent && <Clock className="text-blue-500 h-4 w-4 mt-1" />}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
