"use client";

import React, { createContext, useContext, useState } from 'react';

// Define the shape of our wizard's data and functions
interface WizardContextType {
  wizardData: any;
  setWizardData: (data: any) => void;
  handleStep1Next: (data: { simulationName: string; description: string }) => void;
  handleStep2Next: (data: { companyName: string }) => void;
  handleFinish: (data: any) => Promise<void>;
  loading: boolean;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider: React.FC<{ children: React.ReactNode; onFinish: (data: any) => Promise<void> }> = ({ children, onFinish }) => {
  const [wizardData, setWizardDataState] = useState({});
  const [loading, setLoading] = useState(false);

  const setWizardData = (data: any) => {
    setWizardDataState(prev => ({ ...prev, ...data }));
  };

  const handleStep1Next = (data: { simulationName: string; description: string }) => {
    setWizardData(data);
  };

  const handleStep2Next = (data: { companyName: string }) => {
    setWizardData(data);
  };

  const handleFinish = async (productData: any) => {
    setLoading(true);
    const finalData = { ...wizardData, product: productData };
    await onFinish(finalData);
    setLoading(false);
  }

  const value = { wizardData, setWizardData, handleStep1Next, handleStep2Next, handleFinish, loading };

  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};