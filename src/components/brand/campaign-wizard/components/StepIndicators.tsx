
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Target, Clipboard, DollarSign, Users, Rocket } from 'lucide-react';
import { CampaignStep } from '@/types/campaignWizard';

interface StepIndicatorsProps {
  steps: CampaignStep[];
}

export const StepIndicators: React.FC<StepIndicatorsProps> = ({ steps }) => {
  const getStepIcon = (iconName: string) => {
    const iconMap = {
      'target': Target,
      'clipboard': Clipboard,
      'dollar-sign': DollarSign,
      'users': Users,
      'rocket': Rocket
    };
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="h-6 w-6" /> : null;
  };

  return (
    <div className="flex justify-between mt-8 px-4">
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          className="flex flex-col items-center space-y-3 flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div
            className={`
              w-12 h-12 rounded-full flex items-center justify-center text-lg
              transition-all duration-300 ${
                step.complete
                  ? 'bg-primary text-primary-foreground'
                  : step.current
                  ? 'bg-accent text-accent-foreground ring-4 ring-accent/20'
                  : 'bg-muted text-muted-foreground'
              }
            `}
          >
            {step.complete ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Check className="h-6 w-6" />
              </motion.div>
            ) : (
              getStepIcon(step.icon)
            )}
          </div>
          <div className="text-center max-w-24">
            <div className={`text-sm font-medium ${
              step.current ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {step.title}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {step.description}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
