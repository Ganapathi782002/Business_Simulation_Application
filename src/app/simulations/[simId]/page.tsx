"use client";

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SimulationSetupWizard } from '@/components/setup/simulation-setup-wizard';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Company, Simulation } from '@/components/simulation/types';

interface LobbyData {
    simulation: Simulation;
    userCompanies: Company[];
}

function LobbyLoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <AppLayout>
      <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {Array.from({ length: count > 0 ? count : 3 }).map((_, index) => (
                  <Card key={index}>
                      <CardHeader>
                        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
                      </CardHeader>
                      <CardFooter>
                        <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
                      </CardFooter>
                  </Card>
              ))}
          </div>
      </div>
    </AppLayout>
  );
}

export default function SimulationLobbyPage({ params }: { params: { simId: string } }) {
    const [simulation, setSimulation] = useState<Simulation | null>(null);
    const [userCompanies, setUserCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLobbyData = async () => {
            try {
                const response = await fetch(`/api/simulations/${params.simId}/lobby`);
                if (!response.ok) {
                    throw new Error('Failed to load simulation data.');
                }
                const data: LobbyData = await response.json();
                setSimulation(data.simulation);
                setUserCompanies(data.userCompanies || []);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        fetchLobbyData();
    }, [params.simId]);

    const handleDelete = async (companyId: string, companyName: string) => {
        const originalCompanies = userCompanies;
        setUserCompanies(current => current.filter(c => c.id !== companyId));

        try {
            const response = await fetch(`/api/simulations/${params.simId}/companies/${companyId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete company');
            toast.success("Company deleted successfully.");
        } catch (error) {
            toast.error((error as Error).message);
            setUserCompanies(originalCompanies);
        }
    };



    if (loading) return <LobbyLoadingSkeleton count={userCompanies.length}/>;
    if (error) return <AppLayout><div className="p-6 text-red-500">Error: {error}</div></AppLayout>;
    if (!simulation) return <AppLayout><div className="p-6">Simulation not found.</div></AppLayout>;

    return (
        <AppLayout>
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl text-black font-bold">Below are the companies in: {simulation.name}</h1>
                        <p className="text-muted-foreground">Select a company to manage or create a new one.</p>
                    </div>
                    <SimulationSetupWizard 
                        startStep={2} 
                        simulationId={params.simId} 
                        triggerButton={<Button>Establish New Company</Button>}
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {userCompanies.map((company) => (
                        <Card key={company.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>{company.name}</CardTitle>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" size="icon" className="text-muted-foreground hover:text-destructive flex-shrink-0">
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently delete "{company.name}" and all of its associated data.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(company.id, company.name)}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                                <CardDescription>Cash: ${company.cashBalance.toLocaleString()}</CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Link href={`/simulations/${params.simId}/company/${company.id}`} className="w-full">
                                    <Button className="w-full">Manage Company</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {userCompanies.length === 0 && (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg">
                        <h2 className="text-xl text-black font-semibold">You have no companies in this simulation.</h2>
                        <p className="text-gray-500 mt-2 mb-4">Click the button above to establish your first company.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}