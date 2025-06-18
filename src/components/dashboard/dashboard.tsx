"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Simulation } from '@/components/simulation/types';
import { Skeleton } from '@/components/ui/skeleton';
import { SimulationSetupWizard } from '../setup/simulation-setup-wizard';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogHeader, AlertDialogCancel, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogContent, AlertDialogTrigger } from '../ui/alert-dialog';

export function Dashboard() {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        const response = await fetch('/api/simulations');
        if (!response.ok) {
          throw new Error('Failed to fetch simulations.');
        }
        const data: { simulations?: Simulation[] } = await response.json();
        setSimulations(data.simulations || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSimulations();
  }, []);

  const handleDelete = async (simId: string) => {
    try {
      const response = await fetch(`/api/simulations/${simId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete simulation');
      }
      setSimulations(currentSims => currentSims.filter(s => s.id !== simId));
      toast.success("Simulation deleted successfully.");
    } catch (err) {
      toast.error((err as Error).message)
    }
  };

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-black font-bold">Your Simulations</h1>
        <SimulationSetupWizard />
      </div>

      {simulations.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-xl text-black font-semibold">No Simulations Found</h2>
          <p className="text-gray-500 mt-2 mb-4">Get started by creating your first simulation.</p>
          <SimulationSetupWizard />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {simulations.map((sim) => (
            <Card key={sim.id} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{sim.name}</CardTitle>
                    <CardDescription>{sim.description}</CardDescription>
                    <CardFooter>
                      <p className="text-sm text-gray-500">Period {sim.currentPeriod}</p>
                    </CardFooter>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="text-destructive hover:text-destructive flex-shrink-0">
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the "{sim.name}" simulation and all of its associated data. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(sim.id)}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardFooter>
                <Link href={`/simulations/${sim.id}`} className="w-full">
                  <Button className="w-full">Enter Simulation</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function DashboardLoadingSkeleton() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-44" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card><CardHeader><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full mt-2" /></CardHeader><CardFooter><Skeleton className="h-4 w-1/4" /></CardFooter></Card>
        <Card><CardHeader><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full mt-2" /></CardHeader><CardFooter><Skeleton className="h-4 w-1/4" /></CardFooter></Card>
        <Card><CardHeader><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full mt-2" /></CardHeader><CardFooter><Skeleton className="h-4 w-1/4" /></CardFooter></Card>
      </div>
    </div>
  )
}