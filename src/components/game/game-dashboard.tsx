"use client";

import React from 'react';
import { useSimulation } from '../simulation/simulation-context';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ManageProductDialog } from './manage-product-dialog';

export function GameDashboard() {
  const { state, userCompany, companyProducts, advancePeriod, loading, error } = useSimulation();

  if (loading || !state || !userCompany) {
    return (<div>Loading Simulation...</div>);
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{userCompany.name}</h1>
          <p className="text-gray-500">Period {state.currentPeriod} - {state.name}</p>
        </div>
        <Button onClick={advancePeriod}>Advance to Next Period</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Cash Balance</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">${userCompany.cashBalance.toLocaleString()}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Brand Value</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{userCompany.brandValue.toFixed(1)} / 100</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Credit Rating</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{userCompany.creditRating}</p></CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Your Products</h2>
        {companyProducts.length > 0 ? (
          <div className="space-y-4">
            {companyProducts.map(p => (
              <Card key={p.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{p.name}</CardTitle>
                    <ManageProductDialog product={p} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p>Status: {p.status}</p>
                  <p>Price: ${p.sellingPrice}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p>You have not developed any products yet.</p>
        )}
      </div>
    </div>
  );
}