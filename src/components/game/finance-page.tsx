"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

export function FinancePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Finance Department</h1>
        {/* We will add a "Take Loan" button here */}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Loans</h2>
        <div className="p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
          <p>Loan management UI will go here.</p>
        </div>
      </div>
    </div>
  );
}