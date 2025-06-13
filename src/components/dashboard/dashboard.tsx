"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Simulation } from '@/components/simulation/types';
import { Skeleton } from '@/components/ui/skeleton';
import { SimulationSetupWizard } from '../setup/simulation-setup-wizard';

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
          <p className="text-gray-500 mt-2 mb-4">Get started by creating your simulation.</p>
          <SimulationSetupWizard />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {simulations.map((sim) => (
            <Link href={`/simulations/${sim.id}`} key={sim.id} className="block hover:shadow-lg transition-shadow rounded-lg">
              <Card className="h-full cursor-pointer">
                <CardHeader>
                  <CardTitle>{sim.name}</CardTitle>
                  <CardDescription>{sim.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <p className="text-sm text-gray-500">Period {sim.currentPeriod}</p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardLoadingSkeleton() {
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