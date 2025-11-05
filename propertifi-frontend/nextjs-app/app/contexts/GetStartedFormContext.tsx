'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface GetStartedFormData {
  // Property Type Step
  propertyType?: string;

  // Address Step
  streetAddress?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;

  // Details Step
  bedrooms?: string;
  bathrooms?: string;
  squareFeet?: string;
  squareFootage?: string;
  numberOfUnits?: string;
  yearBuilt?: string;
  propertyCondition?: string;
  additionalServices?: string[];

  // Contact Step
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  preferredContact?: string;
  timeline?: string;
}

interface GetStartedFormContextType {
  formData: GetStartedFormData;
  updateFormData: (data: Partial<GetStartedFormData>) => void;
  resetForm: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
}

const GetStartedFormContext = createContext<GetStartedFormContextType | undefined>(undefined);

export function GetStartedFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<GetStartedFormData>({});
  const [currentStep, setCurrentStep] = useState(0);

  const updateFormData = (data: Partial<GetStartedFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData({});
    setCurrentStep(0);
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4)); // Max 5 steps (0-4)
  };

  const previousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <GetStartedFormContext.Provider
      value={{
        formData,
        updateFormData,
        resetForm,
        currentStep,
        setCurrentStep,
        nextStep,
        previousStep,
      }}
    >
      {children}
    </GetStartedFormContext.Provider>
  );
}

export function useGetStartedForm() {
  const context = useContext(GetStartedFormContext);
  if (context === undefined) {
    throw new Error('useGetStartedForm must be used within a GetStartedFormProvider');
  }
  return context;
}
