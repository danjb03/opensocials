
import { useState } from 'react';

export const useDraftNavigation = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    setCurrentStep(Math.max(1, Math.min(step, 5)));
  };

  return {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    goToStep
  };
};
