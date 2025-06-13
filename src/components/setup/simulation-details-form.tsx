"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SimulationDetailsFormProps {
  onNext: (data: { simulationName: string; description: string }) => void;
}

export function SimulationDetailsForm({ onNext }: SimulationDetailsFormProps) {
  const [simulationName, setSimulationName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleNextClick = () => {
    if (!simulationName || !description) {
      setError('Please fill out both the name and description.');
      return;
    }
    onNext({ simulationName, description });
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Simulation Name</Label>
        <Input
          id="name"
          placeholder="e.g., My Tech Startup Adventure"
          value={simulationName}
          onChange={(e) => setSimulationName(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="A simulation focused on dominating the premium market."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end mt-4">
           <Button onClick={handleNextClick}>Next</Button>
      </div>
    </div>
  );
}