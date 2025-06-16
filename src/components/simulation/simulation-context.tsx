"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SimulationEngine } from './simulation-engine';
import { SimulationFactory } from './simulation-factory';
import { SimulationState, Company, Product, Decision, DecisionPayload } from './types';

// Define the context type
interface SimulationContextType {
  simulation: SimulationEngine | null;
  state: SimulationState | null;
  loading: boolean;
  error: string | null;
  userCompany: Company | null;
  companyProducts: Product[];
  advancePeriod: () => void;
  submitDecision: (decision: DecisionPayload) => void;
  refreshState: () => void;
}

// Create the context with default values
const SimulationContext = createContext<SimulationContextType>({
  simulation: null,
  state: null,
  loading: true,
  error: null,
  userCompany: null,
  companyProducts: [],
  advancePeriod: () => { },
  submitDecision: () => { },
  refreshState: () => { }
});

// Hook to use the simulation context
export const useSimulation = () => useContext(SimulationContext);

// Provider component
export const SimulationProvider: React.FC<{ children: React.ReactNode; initialState: SimulationState }> = ({ children, initialState }) => {
  const [simulation, setSimulation] = useState<SimulationEngine | null>(null);
  const [state, setState] = useState<SimulationState | null>(initialState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userCompany, setUserCompany] = useState<Company | null>(null);
  const [companyProducts, setCompanyProducts] = useState<Product[]>([]);

  // Initialize simulation
  useEffect(() => {
    if (initialState) {
      try {
        const sim = new SimulationEngine(initialState);
        setSimulation(sim);
        setState(initialState);

        const company = initialState.companies.find(c => c.userId === initialState.createdBy);
        setUserCompany(company || null);
        if (company) {
          const products = initialState.products.filter(p => p.companyId === company.id);
          setCompanyProducts(products || []);
        }
      } catch (err) {
        setError('Failed to initialize simulation engine: ' + (err instanceof Error ? err.message : String(err)));
      }
    }
  }, [initialState]);

  const advancePeriod = () => {
    if (!simulation) return;

    try {
      const newState = simulation.advancePeriod();
      setState(newState);

      if (userCompany) {
        const updatedCompany = newState.companies.find(c => c.id === userCompany.id);
        setUserCompany(updatedCompany || null);

        if (updatedCompany) {
          const updatedProducts = newState.products.filter(p => p.companyId === updatedCompany.id);
          setCompanyProducts(updatedProducts);
        }
      }
    } catch (err) {
      setError('Failed to advance period: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const submitDecision = async (decision: DecisionPayload) => {
    if (!simulation || !userCompany || !state) return;

    simulation.submitDecision(userCompany.id, decision);
    refreshState();
    try {
      const response = await fetch(`/api/simulations/${state.id}/decisions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(decision),
      });

      if (!response.ok) {
        console.error("Failed to save decision to the database.");
        setError("Failed to save a decision. Your progress may not be saved on refresh.");
      }
    } catch (err) {
      console.error("Failed to save decision to the database:", err);
      setError("Failed to save a decision. Your progress may not be saved on refresh.");
    }
  };

  // Function to refresh the state
  const refreshState = () => {
    if (!simulation) return;

    try {
      // Get updated state
      const updatedState = simulation.getState();
      setState(updatedState);

      // Update user company and products
      if (userCompany) {
        const updatedCompany = updatedState.companies.find(c => c.id === userCompany.id);
        setUserCompany(updatedCompany || null);

        if (updatedCompany) {
          const updatedProducts = updatedState.products.filter(p => p.companyId === updatedCompany.id);
          setCompanyProducts(updatedProducts);
        }
      }
    } catch (err) {
      setError('Failed to refresh state: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Context value
  const value = {
    simulation,
    state,
    loading,
    error,
    userCompany,
    companyProducts,
    advancePeriod,
    submitDecision,
    refreshState
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};
