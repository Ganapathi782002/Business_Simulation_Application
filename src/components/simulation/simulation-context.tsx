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
  saveState: () => Promise<void>;
  isStateDirty: boolean;
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
  refreshState: () => { },
  saveState: async () => { },
  isStateDirty: false,
});

// Hook to use the simulation context
export const useSimulation = () => useContext(SimulationContext);

// Provider component
export const SimulationProvider: React.FC<{ children: React.ReactNode; initialState: SimulationState; activeCompanyId: string }> = ({ children, initialState, activeCompanyId }) => {
  const [simulation, setSimulation] = useState<SimulationEngine | null>(null);
  const [state, setState] = useState<SimulationState | null>(initialState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userCompany, setUserCompany] = useState<Company | null>(null);
  const [companyProducts, setCompanyProducts] = useState<Product[]>([]);
  const [isStateDirty, setIsStateDirty] = useState(false);

  // Initialize simulation
  useEffect(() => {
    if (initialState && activeCompanyId) {
      try {
        const sim = new SimulationEngine(initialState);
        setSimulation(sim);
        setState(initialState);

        const company = initialState.companies.find(c => c.id === activeCompanyId);
        setUserCompany(company || null);
        if (company) {
          const products = initialState.products.filter(p => p.companyId === company.id);
          setCompanyProducts(products || []);
        }else{
          setCompanyProducts([]);
        }
      } catch (err) {
        setError('Failed to initialize simulation engine: ' + (err instanceof Error ? err.message : String(err)));
      }
    }
  }, [initialState, activeCompanyId]);

  const advancePeriod = () => {
    if (!simulation || !userCompany) return;

    simulation.advancePeriod();
    const newState = simulation.getState();
    const updatedCompany = newState.companies.find(c => c.id === userCompany.id);
    setState(newState);
    setUserCompany(updatedCompany || null);
    if (updatedCompany) {
      const updatedProducts = newState.products.filter(p => p.companyId === updatedCompany.id);
      setCompanyProducts(updatedProducts);
    };
    setIsStateDirty(true);
  }

  const submitDecision = async (decision: DecisionPayload) => {
    if (!simulation || !userCompany || !state) return;

    simulation.submitDecision(userCompany.id, decision);
    refreshState();
    try {
      const response = await fetch(`/api/simulations/${state.id}/decisions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...decision, companyId: userCompany.id}),
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

  const saveState = async () => {
    if (!state) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/simulations/${state.id}/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });

      if (!response.ok) {
        throw new Error("Failed to save the simulation state.");
      }

      console.log("Game saved successfully!");
      setIsStateDirty(false);

    } catch (err) {
      setError('Failed to save progress: ' + (err as Error).message);
    } finally {
      setLoading(false);
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
    refreshState,
    saveState,
    isStateDirty,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};
