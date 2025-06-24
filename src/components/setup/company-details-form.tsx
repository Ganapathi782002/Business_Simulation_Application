"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CompanyDetailsFormProps {
  onNext: (data: { companyName: string }) => void;
  onPrevious?: () => void;
  submitButtonText?: string;
  loading?: boolean;
}

export function CompanyDetailsForm({ onNext, onPrevious, submitButtonText = 'Next', loading = false }: CompanyDetailsFormProps) {
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleNextClick = () => {
    if (!companyName) {
      setError('Please enter a name for your company.');
      return;
    }
    onNext({ companyName });
  };

  return (
    <div className="grid gap-4 py-4">
      <p className="text-sm text-gray-500">
        You have to create a Company inside a simulation. Now, found the company to continue.
      </p>

      <div className="grid gap-2">
        <Label htmlFor="name">Company Name</Label>
        <Input
          id="name"
          placeholder="e.g., QuantumLeap Dynamics"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>

      <div className="mt-4 space-y-4">
        <h4 className="font-medium text-gray-500">Starting Conditions</h4>
        <div className="grid gap-2"><Label htmlFor="cash">Starting Cash</Label><Input id="cash" defaultValue="$1,00,00,000" disabled /></div>
        <div className="grid gap-2"><Label htmlFor="brandValue">Starting Brand Value</Label><Input id="brandValue" defaultValue="50 / 100" disabled /></div>
        <div className="grid gap-2"><Label htmlFor="creditRating">Credit Rating</Label><Input id="creditRating" defaultValue="A" disabled /></div>
      </div>

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      <div className="flex justify-between mt-4">
        {onPrevious ? (
          <Button variant="outline" onClick={onPrevious} disabled={loading}>Previous</Button>
        ) : (
          <div></div>
        )}
        <Button onClick={handleNextClick} disabled={loading}>
          {loading ? 'Submitting...' : submitButtonText}
        </Button>
      </div>
    </div>
  );
}