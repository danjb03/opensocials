
import { useState } from 'react';

export const useDraftNavigation = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep(prev => {
      const newStep = Math.min(prev + 1, 5);
      console.log('Moving to next step:', newStep);
      return newStep;
    });
  };

  const prevStep = () => {
    setCurrentStep(prev => {
      const newStep = Math.max(prev - 1, 1);
      console.log('Moving to previous step:', newStep);
      return newStep;
    });
  };

  const goToStep = (step: number) => {
    const newStep = Math.max(1, Math.min(step, 5));
    console.log('Going to step:', newStep);
    setCurrentStep(newStep);
  };

  return {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    goToStep
  };
};
