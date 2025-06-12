"use client";

import React from 'react';
import { AuthProvider } from '../lib/auth-context';
import { DatabaseProvider } from '../lib/database-context';
import { AuthPage } from '../components/auth/auth-page';
import { SimulationProvider } from '../components/simulation/simulation-context';
import { AppLayout } from '../components/layout/app-layout';
import { Dashboard } from '../components/dashboard/dashboard';
import { useAuth } from '../lib/auth-context';

// Main app component that handles authentication state
function AppContent() {
  const { user, loading } = useAuth();
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading...</h2>
          <p className="mt-2 text-gray-600">Please wait while we set up your simulation</p>
        </div>
      </div>
    );
  }
  
  // Show auth page if not logged in
  if (!user) {
    return <AuthPage />;
  }
  
  // Show main app if logged in
  return (
    <SimulationProvider>
      <AppLayout>
        <Dashboard />
      </AppLayout>
    </SimulationProvider>
  );
}

// Root component with all providers
export default function App() {
  return (
    <DatabaseProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </DatabaseProvider>
  );
}
