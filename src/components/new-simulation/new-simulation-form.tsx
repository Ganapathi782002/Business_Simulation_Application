"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function NewSimulationForm() {
  const [simulationName, setSimulationName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!simulationName && !description) {
      setError('Please enter a name and description for your simulation.');
      return;
    }
    
    setLoading(true);
    try{
      const response = await fetch('/api/simulations',{ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ simulationName, description })
    });
      const data: {error: string; simulationId?: string} = await response.json();

      if(!response.ok){
        throw new Error(data.error || 'Failed to create simulation.');
      }
      console.log('Successfully created simulation with ID:', data.simulationId);

      window.location.href = '/';
    }catch(err){
      setError((err as Error).message);
    }finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create a New Simulation</CardTitle>
        <CardDescription>
          Start a new simulation. Give your simulation a unique name to identify it later.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Simulation Name</Label>
              <Input 
                id="name" 
                placeholder="e.g., My First Tech Startup" 
                value={simulationName}
                onChange={(e) => setSimulationName(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                placeholder="e.g., Description about the simulation" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Simulation'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}